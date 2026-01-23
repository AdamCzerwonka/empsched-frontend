# Plan implementacji PWA: Notyfikacje + Badging API - Wersja ostateczna

## 📋 Spis treści

1. [Przegląd](#1-przegląd)
2. [Architektura Backend](#2-architektura-backend)
3. [Architektura Frontend](#3-architektura-frontend)
4. [Struktura danych](#4-struktura-danych)
5. [Endpointy API](#5-endpointy-api)
6. [Service Worker](#6-service-worker)
7. [Badging API](#7-badging-api)
8. [Przepływ danych](#8-przepływ-danych)
9. [Plan wdrożenia](#9-plan-wdrożenia)
10. [Migracja danych](#10-migracja-danych)

---

## 1. Przegląd

### Cel
Dodanie systemu powiadomień push związanych z nieobecnościami (absences) oraz integracja Badging API do wyświetlania liczby nieprzeczytanych powiadomień.

### Zakres funkcjonalności
- **Notyfikacje push** - powiadomienia o wnioskach urlopowych i ich statusach
- **Centrum powiadomień** - panel w aplikacji do przeglądania i zarządzania powiadomieniami
- **Badging API** (Fugu) - licznik nieprzeczytanych powiadomień na ikonie aplikacji
- **Synchronizacja z backendem** - historia powiadomień, oznaczenie jako przeczytane

### Role i scenariusze powiadomień

| Rola | Otrzymuje powiadomienia o |
|------|---------------------------|
| ORGANISATION_ADMIN | Nowy wniosek o nieobecność od pracownika |
| ORGANISATION_EMPLOYEE | Zatwierdzenie/odrzucenie własnego wniosku |
| ADMIN | Wszystkie powyższe (opcjonalnie) |

---

## 2. Architektura Backend

### 2.1 Diagram przepływu

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        API GATEWAY                                  │   │
│  │                    (routing, auth)                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                         │                                                   │
│         ┌───────────────┼───────────────┐                                 │
│         ▼               ▼               ▼                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐                │
│  │ AuthService │ │EmployeeSvc │ │  NotificationService │                │
│  │             │ │            │ │  (NOWY)              │                │
│  │ - Users     │ │ - Absences │ │  - PushSubscription  │                │
│  │ - JWT       │ │ - Employees│ │  - VAPID keys        │                │
│  │             │ │ - Approval │ │  - Send push         │                │
│  └─────────────┘ └─────────────┘ └─────────────────────┘                │
│                         │                    ▲                              │
│                         │    Event           │                              │
│                         └────────────────────┘                              │
│                      (Absence created/approved/rejected)                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Zmiany w EmployeeService

#### 2.2.1 Enum AbsenceStatus

```java
// EmployeeService/src/main/java/.../employee/enums/AbsenceStatus.java
public enum AbsenceStatus {
    PENDING,    // Oczekuje na rozpatrzenie (domyślna wartość)
    APPROVED,   // Zatwierdzony
    REJECTED    // Odrzucony
}
```

#### 2.2.2 Modyfikacja encji Absence

```java
// EmployeeService/src/main/java/.../employee/entity/Absence.java
@Entity
public class Absence extends AbstractEntity {
    // ... istniejące pola ...
    
    // USUNĄĆ:
    // @Column(nullable = false)
    // private boolean approved;
    
    // DODAĆ:
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AbsenceStatus status = AbsenceStatus.PENDING;
}
```

#### 2.2.3 DTO - AbsenceResponse

```java
// EmployeeService/src/main/java/.../employee/dto/AbsenceResponse.java
public record AbsenceResponse(
    UUID id,
    String description,
    AbsenceReason reason,
    AbsenceStatus status,           // Zamiast boolean approved
    LocalDate startDate,
    LocalDate endDate,
    EmployeeResponse employee,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
```

#### 2.2.4 Endpointy AbsenceController

```java
// EmployeeService/src/main/java/.../employee/controller/AbsenceController.java

@RestController
@RequestMapping("/employees/absences")
public class AbsenceController {
    
    // Istniejące endpointy...
    
    // NOWE endpointy:
    
    @PostMapping("/{absenceId}/approve")
    @PreAuthorize("hasRole('ORGANISATION_ADMIN')")
    public ResponseEntity<AbsenceResponse> approveAbsence(@PathVariable UUID absenceId) {
        Absence absence = absenceService.approveAbsence(absenceId);
        return ResponseEntity.ok(absenceMapper.toResponse(absence));
    }
    
    @PostMapping("/{absenceId}/reject")
    @PreAuthorize("hasRole('ORGANISATION_ADMIN')")
    public ResponseEntity<AbsenceResponse> rejectAbsence(
        @PathVariable UUID absenceId,
        @RequestBody(required = false) AbsenceRejectRequest request
    ) {
        Absence absence = absenceService.rejectAbsence(absenceId);
        return ResponseEntity.ok(absenceMapper.toResponse(absence));
    }
    
    @GetMapping("/pending")
    @PreAuthorize("hasRole('ORGANISATION_ADMIN')")
    public ResponseEntity<List<AbsenceResponse>> getPendingAbsences() {
        List<Absence> pending = absenceService.findPendingAbsences();
        return ResponseEntity.ok(pending.stream()
            .map(absenceMapper::toResponse)
            .toList());
    }
}

// Request DTO
public record AbsenceRejectRequest() {}
```

#### 2.2.5 Serwis AbsenceService

```java
// EmployeeService/src/main/java/.../employee/service/AbsenceService.java

@Service
public class AbsenceService {
    
    private final AbsenceRepository absenceRepository;
    private final AbsenceNotificationService notificationService;
    
    @Transactional
    public Absence createAbsence(Absence absence, UUID employeeId) {
        absence.setStatus(AbsenceStatus.PENDING);
        Absence saved = absenceRepository.save(absence);
        
        // TRIGGER: Powiadom adminów organizacji
        notificationService.notifyAdminsOfNewAbsenceRequest(saved);
        
        return saved;
    }
    
    @Transactional
    public Absence approveAbsence(UUID absenceId) {
        Absence absence = findById(absenceId);
        absence.setStatus(AbsenceStatus.APPROVED);
        Absence saved = absenceRepository.save(absence);
        
        notificationService.notifyEmployeeOfAbsenceDecision(saved, true);
        
        return saved;
    }
    
    @Transactional
    public Absence rejectAbsence(UUID absenceId) {
        Absence absence = findById(absenceId);
        absence.setStatus(AbsenceStatus.REJECTED);
        Absence saved = absenceRepository.save(absence);
        
        // TRIGGER: Powiadom pracownika
        notificationService.notifyEmployeeOfAbsenceDecision(saved, false);
        
        return saved;
    }
    
    public List<Absence> findPendingAbsences() {
        return absenceRepository.findByStatus(AbsenceStatus.PENDING);
    }
}
```

#### 2.2.6 Repository

```java
// EmployeeService/src/main/java/.../employee/repository/AbsenceRepository.java

public interface AbsenceRepository extends JpaRepository<Absence, UUID> {
    List<Absence> findByStatus(AbsenceStatus status);
    List<Absence> findByStatusIn(List<AbsenceStatus> statuses);
    List<Absence> findByStatusAndEmployeeId(AbsenceStatus status, UUID employeeId);
    List<Absence> findByEmployeeId(UUID employeeId);
}
```

### 2.3 Zmiany w AuthService (lub nowy NotificationService)

#### 2.3.1 Encja PushSubscription

```java
// AuthService/src/main/java/.../auth/entity/PushSubscription.java
@Entity
@Table(name = "push_subscriptions")
public class PushSubscription extends AbstractEntity {
    
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false, length = 500)
    private String endpoint;        // Web Push endpoint URL
    
    @Column(nullable = false, length = 100)
    private String p256dh;          // Public key (Base64)
    
    @Column(nullable = false, length = 50)
    private String auth;            // Auth secret (Base64)
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    // Getters, setters...
}
```

#### 2.3.2 Encja Notification (opcjonalnie, dla historii)

```java
// AuthService lub NotificationService/src/main/java/.../notification/entity/Notification.java
@Entity
@Table(name = "notifications")
public class Notification extends AbstractEntity {
    
    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User recipient;
    
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private NotificationType type;  // ABSENCE_REQUEST_NEW, ABSENCE_APPROVED, etc.
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, length = 1000)
    private String body;
    
    @Column(nullable = false)
    private Boolean read = false;
    
    @Column(nullable = true)
    private String relatedEntityId;  // ID absence, employee, etc.
    
    @Column(nullable = true)
    private String relatedEntityType; // "absence", "employee", etc.
    
    @Column(nullable = true, length = 500)
    private String url;              // URL do otwarcia po kliknięciu
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    // Getters, setters...
}

public enum NotificationType {
    ABSENCE_REQUEST_NEW,
    ABSENCE_REQUEST_APPROVED,
    ABSENCE_REQUEST_REJECTED
}
```

#### 2.3.3 Endpointy PushSubscriptionController

```java
// AuthService/src/main/java/.../auth/controller/PushSubscriptionController.java

@RestController
@RequestMapping("/push-subscriptions")
public class PushSubscriptionController {
    
    private final PushSubscriptionService subscriptionService;
    private final VapidConfig vapidConfig;
    
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> subscribe(@RequestBody PushSubscriptionRequest request) {
        UUID userId = getCurrentUserId(); // Z SecurityContext
        subscriptionService.subscribe(userId, request);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> unsubscribe(@RequestParam String endpoint) {
        UUID userId = getCurrentUserId();
        subscriptionService.unsubscribe(userId, endpoint);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/vapid-public-key")
    public ResponseEntity<VapidPublicKeyResponse> getVapidPublicKey() {
        return ResponseEntity.ok(new VapidPublicKeyResponse(vapidConfig.getPublicKey()));
    }
}

// Request/Response DTOs
public record PushSubscriptionRequest(
    @NotBlank String endpoint,
    @NotBlank String p256dh,
    @NotBlank String auth
) {}

public record VapidPublicKeyResponse(String publicKey) {}
```

#### 2.3.4 Endpointy NotificationController (dla historii)

```java
// AuthService lub NotificationService/src/main/java/.../notification/controller/NotificationController.java

@RestController
@RequestMapping("/notifications")
public class NotificationController {
    
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PagedData<NotificationResponse>> getNotifications(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) Boolean read
    ) {
        UUID userId = getCurrentUserId();
        PagedData<Notification> notifications = notificationService.getNotifications(
            userId, page, size, read
        );
        return ResponseEntity.ok(notifications.map(NotificationMapper::toResponse));
    }
    
    @PatchMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> markAsRead(@PathVariable UUID id) {
        UUID userId = getCurrentUserId();
        notificationService.markAsRead(userId, id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UnreadCountResponse> getUnreadCount() {
        UUID userId = getCurrentUserId();
        int count = notificationService.countUnreadByUserId(userId);
        return ResponseEntity.ok(new UnreadCountResponse(count));
    }
}

public record UnreadCountResponse(int count) {}
```

#### 2.3.5 WebPushService

```java
// AuthService lub NotificationService/src/main/java/.../notification/service/WebPushService.java

@Service
public class WebPushService {
    
    private final PushSubscriptionRepository subscriptionRepository;
    private final NotificationRepository notificationRepository; // Jeśli używamy historii
    private final VapidConfig vapidConfig;
    private final WebPushClient webPushClient;
    
    /**
     * Wysyła powiadomienie push do użytkownika
     */
    public void sendPushNotification(UUID userId, PushNotificationPayload payload) {
        // 1. Pobierz liczbę nieprzeczytanych (dla badge)
        int unreadCount = notificationRepository.countUnreadByUserId(userId);
        
        // 2. Dodaj unreadCount do payload
        payload = payload.withUnreadCount(unreadCount);
        
        // 3. Zapisz powiadomienie w bazie (jeśli używamy historii)
        Notification notification = createNotification(userId, payload);
        notificationRepository.save(notification);
        
        // 4. Pobierz aktywne subskrypcje
        List<PushSubscription> subscriptions = 
            subscriptionRepository.findByUserIdAndActiveTrue(userId);
        
        // 5. Wyślij push do każdej subskrypcji
        for (PushSubscription sub : subscriptions) {
            try {
                sendWebPush(sub, payload);
            } catch (ExpiredSubscriptionException e) {
                // Oznacz subskrypcję jako nieaktywną
                sub.setActive(false);
                subscriptionRepository.save(sub);
            }
        }
    }
    
    /**
     * Wysyła powiadomienie do wszystkich adminów organizacji
     */
    public void sendToOrganisationAdmins(UUID organisationId, PushNotificationPayload payload) {
        List<User> admins = userRepository.findByOrganisationIdAndRole(
            organisationId, Role.ORGANISATION_ADMIN);
        
        for (User admin : admins) {
            sendPushNotification(admin.getId(), payload);
        }
    }
    
    private void sendWebPush(PushSubscription subscription, PushNotificationPayload payload) {
        // Implementacja wysyłania Web Push przez bibliotekę web-push
        // ...
    }
}
```

#### 2.3.6 Payload powiadomienia

```java
// AuthService lub NotificationService/src/main/java/.../notification/dto/PushNotificationPayload.java

public record PushNotificationPayload(
    String type,        // "ABSENCE_REQUEST_NEW", "ABSENCE_APPROVED", "ABSENCE_REJECTED"
    String title,
    String body,
    String url,         // URL do otwarcia po kliknięciu
    Integer unreadCount, // NOWE - liczba nieprzeczytanych (dla badge)
    Map<String, String> data  // Dodatkowe dane (absenceId, employeeId, etc.)
) {
    public PushNotificationPayload withUnreadCount(int count) {
        return new PushNotificationPayload(
            type, title, body, url, count, data
        );
    }
}
```

#### 2.3.7 AbsenceNotificationService - triggery

```java
// EmployeeService/src/main/java/.../employee/service/AbsenceNotificationService.java

@Service
public class AbsenceNotificationService {
    
    private final WebPushService webPushService;
    private final EmployeeRepository employeeRepository;
    
    public void notifyAdminsOfNewAbsenceRequest(Absence absence) {
        Employee employee = employeeRepository.findById(absence.getEmployeeId())
            .orElseThrow();
        UUID organisationId = employee.getOrganisationId();
        
        PushNotificationPayload payload = new PushNotificationPayload(
            "ABSENCE_REQUEST_NEW",
            "Nowy wniosek o nieobecność",
            String.format("%s %s złożył wniosek o nieobecność", 
                employee.getFirstName(), employee.getLastName()),
            "/organisation?tab=pending-absences",
            null, // unreadCount zostanie obliczony w WebPushService
            Map.of(
                "absenceId", absence.getId().toString(),
                "employeeId", employee.getId().toString(),
                "employeeName", employee.getFirstName() + " " + employee.getLastName()
            )
        );
        
        webPushService.sendToOrganisationAdmins(organisationId, payload);
    }
    
    public void notifyEmployeeOfAbsenceDecision(Absence absence, boolean approved) {
        Employee employee = employeeRepository.findById(absence.getEmployeeId())
            .orElseThrow();
        
        String type = approved ? "ABSENCE_APPROVED" : "ABSENCE_REJECTED";
        String title = approved ? "Wniosek zatwierdzony" : "Wniosek odrzucony";
        String body = approved 
            ? "Twój wniosek o nieobecność został zatwierdzony"
            : "Twój wniosek o nieobecność został odrzucony" + 
              (absence.getRejectionReason() != null 
                  ? ": " + absence.getRejectionReason() 
                  : "");
        
        PushNotificationPayload payload = new PushNotificationPayload(
            type,
            title,
            body,
            "/absences",
            null,
            Map.of(
                "absenceId", absence.getId().toString()
            )
        );
        
        webPushService.sendPushNotification(employee.getUserId(), payload);
    }
}
```

#### 2.3.8 Konfiguracja VAPID

```yaml
# application.yml (AuthService lub NotificationService)
push-notifications:
  vapid:
    public-key: ${VAPID_PUBLIC_KEY}    # Base64 encoded
    private-key: ${VAPID_PRIVATE_KEY}  # Base64 encoded
    subject: mailto:admin@empsched.com
```

**Generowanie kluczy VAPID:**
```bash
npx web-push generate-vapid-keys
```

#### 2.3.9 Zależności Maven

```xml
<!-- W AuthService lub NotificationService pom.xml -->
<dependency>
    <groupId>nl.martijndwars</groupId>
    <artifactId>web-push</artifactId>
    <version>5.1.1</version>
</dependency>
```

---

## 3. Architektura Frontend

### 3.1 Struktura plików

```
empsched-frontend/
├── app/
│   ├── components/
│   │   └── notifications/
│   │       ├── NotificationCenter.tsx      # Dropdown z listą powiadomień
│   │       ├── NotificationItem.tsx        # Pojedyncze powiadomienie
│   │       ├── NotificationBell.tsx        # Ikona dzwonka z badge'm
│   │       └── NotificationPermission.tsx  # Prompt o zgodę na powiadomienia
│   │
│   ├── store/
│   │   └── notificationStore.ts            # Zustand store dla powiadomień
│   │
│   ├── hooks/
│   │   ├── useNotifications.ts             # Hook do zarządzania powiadomieniami
│   │   └── use-mobile.ts                   # Istniejący
│   │
│   ├── api/
│   │   ├── hooks/
│   │   │   └── notification/
│   │   │       ├── useNotifications.ts      # Hook do pobierania powiadomień
│   │   │       ├── useMarkAsRead.ts         # Hook do oznaczenia jako read
│   │   │       └── useUnreadCount.ts       # Hook do pobierania count
│   │   └── pushSubscription.ts             # API calls dla subskrypcji push
│   │
│   ├── types/
│   │   ├── general/
│   │   │   ├── enums/
│   │   │   │   └── AbsenceStatusEnum.ts    # NOWY enum
│   │   │   └── model/
│   │   │       └── Absence.ts              # ZMODYFIKOWANY (status zamiast approved)
│   │   └── notification.ts                 # Typy dla powiadomień
│   │
│   ├── lib/
│   │   ├── badgeApi.ts                     # Wrapper dla Badging API
│   │   ├── pushUtils.ts                    # urlBase64ToUint8Array
│   │   └── absenceUtils.ts                 # Helper functions (isPending, etc.)
│   │
│   └── routes/
│       └── _base.organisation/
│           └── PendingAbsencesDetails.tsx  # NOWY - lista pending absences
│
└── sw.ts                                   # Rozszerzenie Service Workera
```

### 3.2 Typy

#### 3.2.1 AbsenceStatusEnum

```typescript
// app/types/general/enums/AbsenceStatusEnum.ts
export enum AbsenceStatusEnum {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export type AbsenceStatus = keyof typeof AbsenceStatusEnum;
```

#### 3.2.2 Absence (zmodyfikowany)

```typescript
// app/types/general/model/Absence.ts
import type { AbsenceReasonEnum } from "../enums/AbsenceReasonEnum";
import type { AbsenceStatusEnum } from "../enums/AbsenceStatusEnum";

export interface Absence {
  id: string;
  description: string;
  reason: AbsenceReasonEnum;
  employeeId: string;
  status: AbsenceStatusEnum; // Zamiast approved: boolean
  startDate: string;
  endDate: string;
}
```

#### 3.2.3 Notification types

```typescript
// app/types/notification.ts

export type NotificationType =
  | 'ABSENCE_REQUEST_NEW'        // Nowy wniosek (dla admina)
  | 'ABSENCE_REQUEST_APPROVED'   // Wniosek zatwierdzony (dla pracownika)
  | 'ABSENCE_REQUEST_REJECTED';  // Wniosek odrzucony (dla pracownika)

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  url?: string;                  // URL do nawigacji
  data?: {
    absenceId?: string;
    employeeId?: string;
    employeeName?: string;
  };
}

export interface PushSubscriptionRequest {
  endpoint: string;
  p256dh: string;
  auth: string;
}
```

### 3.3 Helper functions

#### 3.3.1 absenceUtils.ts

```typescript
// app/lib/absenceUtils.ts
import { AbsenceStatusEnum } from "~/types/general/enums/AbsenceStatusEnum";
import type { Absence } from "~/types/general";

export function isApproved(absence: Absence): boolean {
  return absence.status === AbsenceStatusEnum.APPROVED;
}

export function isRejected(absence: Absence): boolean {
  return absence.status === AbsenceStatusEnum.REJECTED;
}

export function isPending(absence: Absence): boolean {
  return absence.status === AbsenceStatusEnum.PENDING;
}

export function canDelete(absence: Absence): boolean {
  return isPending(absence);
}
```

#### 3.3.2 pushUtils.ts

```typescript
// app/lib/pushUtils.ts

/**
 * Konwertuje Base64 URL-safe string na Uint8Array
 * Wymagane dla Web Push API (VAPID public key)
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
```

#### 3.3.3 badgeApi.ts

```typescript
// app/lib/badgeApi.ts

export const badgeApi = {
  isSupported(): boolean {
    return 'setAppBadge' in navigator;
  },

  async setBadge(count: number): Promise<void> {
    if (!this.isSupported()) return;

    try {
      if (count > 0) {
        await (navigator as any).setAppBadge(count);
      } else {
        await (navigator as any).clearAppBadge();
      }
    } catch (error) {
      console.warn('Badge API error:', error);
    }
  },

  async clearBadge(): Promise<void> {
    if (!this.isSupported()) return;

    try {
      await (navigator as any).clearAppBadge();
    } catch (error) {
      console.warn('Badge API error:', error);
    }
  },
};
```

### 3.4 API hooks

#### 3.4.1 pushSubscription.ts

```typescript
// app/api/pushSubscription.ts
import { api } from "~/api/api";
import type { PushSubscriptionRequest } from "~/types/notification";

export const pushSubscriptionApi = {
  subscribe: (data: PushSubscriptionRequest) =>
    api.post('/push-subscriptions', data),

  unsubscribe: (endpoint: string) =>
    api.delete('/push-subscriptions', { params: { endpoint } }),

  getVapidPublicKey: () =>
    api.get<{ publicKey: string }>('/push-subscriptions/vapid-public-key'),
};
```

#### 3.4.2 notification hooks

```typescript
// app/api/hooks/notification/useNotifications.ts
import { useQuery } from "@tanstack/react-query";
import { api } from "~/api/api";
import type { AppNotification, PagedData } from "~/types";

export const useNotifications = (params?: {
  page?: number;
  size?: number;
  read?: boolean;
}) => {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const response = await api.get<PagedData<AppNotification>>(
        '/notifications',
        { params }
      );
      return response.data;
    },
  });
};

// app/api/hooks/notification/useUnreadCount.ts
export const useUnreadCount = () => {
  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const response = await api.get<{ count: number }>(
        '/notifications/unread-count'
      );
      return response.data;
    },
    refetchInterval: 30000, // Odśwież co 30 sekund
  });
};

// app/api/hooks/notification/useMarkAsRead.ts
export const useMarkAsRead = () => {
  return useMutation({
    mutationFn: async (notificationId: string) => {
      await api.patch(`/notifications/${notificationId}/read`);
    },
  });
};
```

#### 3.4.3 absence hooks (nowe)

```typescript
// app/api/hooks/absence/useApproveAbsence.ts
import { useMutation } from "@tanstack/react-query";
import { api } from "~/api/api";
import { employeeEndpoints } from "~/constants";

export const useApproveAbsence = () => {
  return useMutation({
    mutationFn: async (absenceId: string) => {
      const response = await api.post(
        `${employeeEndpoints.base}/absences/${absenceId}/approve`
      );
      return response.data;
    },
  });
};

// app/api/hooks/absence/useRejectAbsence.ts
export const useRejectAbsence = () => {
  return useMutation({
    mutationFn: async ({ absenceId, reason }: { absenceId: string; reason?: string }) => {
      const response = await api.post(
        `${employeeEndpoints.base}/absences/${absenceId}/reject`,
        { reason }
      );
      return response.data;
    },
  });
};

// app/api/hooks/absence/usePendingAbsences.ts
export const usePendingAbsences = () => {
  return useQuery({
    queryKey: ['pending-absences'],
    queryFn: async () => {
      const response = await api.get<Absence[]>(
        `${employeeEndpoints.base}/absences/pending`
      );
      return response.data;
    },
  });
};
```

### 3.5 Store (Zustand)

```typescript
// app/store/notificationStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AppNotification } from "~/types/notification";

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (notification: AppNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setUnreadCount: (count: number) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,

      addNotification: (notification) =>
        set((state) => ({
          notifications: [notification, ...state.notifications],
          unreadCount: notification.read ? state.unreadCount : state.unreadCount + 1,
        })),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      setUnreadCount: (count) => set({ unreadCount: count }),

      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: "notification-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### 3.6 Hook useNotifications

```typescript
// app/hooks/useNotifications.ts
import { useEffect } from "react";
import { useNotificationStore } from "~/store/notificationStore";
import { pushSubscriptionApi } from "~/api/pushSubscription";
import { urlBase64ToUint8Array } from "~/lib/pushUtils";
import { badgeApi } from "~/lib/badgeApi";
import { useUnreadCount } from "~/api/hooks/notification/useUnreadCount";

export function useNotifications() {
  const store = useNotificationStore();
  const { data: unreadCountData } = useUnreadCount();

  // Synchronizuj badge z backendem
  useEffect(() => {
    if (unreadCountData?.count !== undefined) {
      store.setUnreadCount(unreadCountData.count);
      badgeApi.setBadge(unreadCountData.count);
    }
  }, [unreadCountData, store]);

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await subscribeToPush();
    }
    return permission;
  };

  const subscribeToPush = async () => {
    // 1. Pobierz VAPID public key z backendu
    const { publicKey } = await pushSubscriptionApi.getVapidPublicKey();

    // 2. Zarejestruj w Service Worker
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });

    // 3. Wyślij subskrypcję do backendu
    const { endpoint, keys } = subscription.toJSON();
    await pushSubscriptionApi.subscribe({
      endpoint: endpoint!,
      p256dh: keys!.p256dh!,
      auth: keys!.auth!,
    });
  };

  return {
    ...store,
    requestPermission,
    subscribeToPush,
  };
}
```

### 3.7 Komponenty

#### 3.7.1 NotificationBell.tsx

```typescript
// app/components/notifications/NotificationBell.tsx
import { Bell } from "lucide-react";
import { Button } from "~/components/ui";
import { useNotificationStore } from "~/store/notificationStore";
import { NotificationCenter } from "./NotificationCenter";

export const NotificationBell = () => {
  const { unreadCount } = useNotificationStore();

  return (
    <div className="relative">
      <Button variant="ghost" size="icon">
        <Bell />
      </Button>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
      <NotificationCenter />
    </div>
  );
};
```

#### 3.7.2 NotificationCenter.tsx

```typescript
// app/components/notifications/NotificationCenter.tsx
import { useNotificationStore } from "~/store/notificationStore";
import { useNotifications } from "~/api/hooks/notification/useNotifications";
import { NotificationItem } from "./NotificationItem";
import { ScrollArea } from "~/components/ui";

export const NotificationCenter = () => {
  const { data: notifications } = useNotifications({ size: 20 });
  const { markAsRead } = useNotificationStore();

  return (
    <div className="w-80 max-h-96">
      <ScrollArea>
        {notifications?.content.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRead={() => markAsRead(notification.id)}
          />
        ))}
      </ScrollArea>
    </div>
  );
};
```

#### 3.7.3 PendingAbsencesDetails.tsx

```typescript
// app/routes/_base.organisation/PendingAbsencesDetails.tsx
import { usePendingAbsences } from "~/api/hooks/absence/usePendingAbsences";
import { useApproveAbsence, useRejectAbsence } from "~/api/hooks/absence";
import { AbsenceItemWithActions } from "~/components/notifications/AbsenceItemWithActions";

export const PendingAbsencesDetails = () => {
  const { data: pendingAbsences } = usePendingAbsences();
  const { mutateAsync: approve } = useApproveAbsence();
  const { mutateAsync: reject } = useRejectAbsence();

  return (
    <div>
      {pendingAbsences?.map((absence) => (
        <AbsenceItemWithActions
          key={absence.id}
          absence={absence}
          onApprove={() => approve(absence.id)}
          onReject={(reason) => reject({ absenceId: absence.id, reason })}
        />
      ))}
    </div>
  );
};
```

---

## 4. Struktura danych

### 4.1 Absence (zmieniony)

```typescript
interface Absence {
  id: string;
  description: string;
  reason: AbsenceReasonEnum;
  employeeId: string;
  status: AbsenceStatusEnum;        // PENDING | APPROVED | REJECTED
  rejectionReason?: string | null; // Opcjonalnie: powód odrzucenia
  startDate: string;
  endDate: string;
}
```

### 4.2 Notification

```typescript
interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: Date;
  read: boolean;
  url?: string;
  data?: {
    absenceId?: string;
    employeeId?: string;
    employeeName?: string;
  };
}
```

### 4.3 PushSubscription

```typescript
interface PushSubscription {
  id: string;
  userId: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  active: boolean;
  createdAt: Date;
}
```

---

## 5. Endpointy API

### 5.1 Push Subscriptions

| Metoda | Endpoint | Opis | Autoryzacja |
|--------|----------|------|-------------|
| POST | `/push-subscriptions` | Rejestracja subskrypcji push | Authenticated |
| DELETE | `/push-subscriptions?endpoint=...` | Usunięcie subskrypcji | Authenticated |
| GET | `/push-subscriptions/vapid-public-key` | Pobranie klucza publicznego VAPID | Public |

### 5.2 Notifications

| Metoda | Endpoint | Opis | Autoryzacja |
|--------|----------|------|-------------|
| GET | `/notifications?page=0&size=20&read=false` | Lista powiadomień | Authenticated |
| PATCH | `/notifications/{id}/read` | Oznaczenie jako przeczytane | Authenticated |
| GET | `/notifications/unread-count` | Liczba nieprzeczytanych | Authenticated |

### 5.3 Absences (nowe endpointy)

| Metoda | Endpoint | Opis | Autoryzacja |
|--------|----------|------|-------------|
| POST | `/employees/absences/{id}/approve` | Zatwierdzenie wniosku | ORGANISATION_ADMIN |
| POST | `/employees/absences/{id}/reject` | Odrzucenie wniosku | ORGANISATION_ADMIN |
| GET | `/employees/absences/pending` | Lista wniosków do rozpatrzenia | ORGANISATION_ADMIN |

---

## 6. Service Worker

### 6.1 Rozszerzenie sw.ts

```typescript
// sw.ts (rozszerzenie istniejącego)
import { defaultCache } from "@serwist/vite/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();

// ========== NOWE: Push Notifications ==========

// Push event listener
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const payload = event.data.json();

  const options: NotificationOptions = {
    body: payload.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: {
      url: payload.url,
      ...payload.data,
    },
    actions: [
      { action: 'open', title: 'Otwórz' },
      { action: 'dismiss', title: 'Odrzuć' },
    ],
  };

  event.waitUntil(
    Promise.all([
      self.registration.showNotification(payload.title, options),
      updateBadge(payload.unreadCount || 0), // Użyj count z payload
    ])
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Focus existing window or open new
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});

// Push subscription change handler (odnawianie subskrypcji)
self.addEventListener('pushsubscriptionchange', async (event) => {
  // Subskrypcja wygasła lub zmieniła się
  const newSubscription = await self.registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY), // Z cache lub z głównej aplikacji
  });

  // Wyślij nową subskrypcję do backendu
  event.waitUntil(
    fetch('/push-subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        endpoint: newSubscription.endpoint,
        p256dh: btoa(String.fromCharCode(...new Uint8Array(newSubscription.getKey('p256dh')))),
        auth: btoa(String.fromCharCode(...new Uint8Array(newSubscription.getKey('auth')))),
      }),
    })
  );
});

// Helper function: update badge
async function updateBadge(count: number) {
  if ('setAppBadge' in navigator) {
    try {
      if (count > 0) {
        await (navigator as any).setAppBadge(count);
      } else {
        await (navigator as any).clearAppBadge();
      }
    } catch (error) {
      console.warn('Badge API error:', error);
    }
  }

  // Komunikacja z główną aplikacją przez postMessage
  const allClients = await clients.matchAll();
  for (const client of allClients) {
    client.postMessage({ 
      type: 'NOTIFICATION_RECEIVED',
      unreadCount: count 
    });
  }
}

// Helper function: urlBase64ToUint8Array (dla pushsubscriptionchange)
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
```

### 6.2 Komunikacja SW ↔ aplikacja

```typescript
// app/root.tsx - dodać listener dla postMessage
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data.type === 'NOTIFICATION_RECEIVED') {
        // Zaktualizuj store z nowym count
        useNotificationStore.getState().setUnreadCount(event.data.unreadCount);
      }
    });
  }
}, []);
```

---

## 7. Badging API

### 7.1 Aktualizacja badge

**Gdy aplikacja zamknięta:**
- Badge aktualizuje się z `unreadCount` w payload push (Service Worker)

**Gdy aplikacja otwarta:**
- Badge synchronizuje się z `GET /notifications/unread-count` przy starcie
- Badge aktualizuje się po oznaczeniu powiadomienia jako read

**Implementacja:**
- Użyj `badgeApi.setBadge(count)` z `app/lib/badgeApi.ts`
- Wywołaj w `useNotifications` hook przy synchronizacji z backendem

---

## 8. Przepływ danych

### 8.1 Scenariusz 1: Pracownik składa wniosek

```
1. Pracownik → POST /employees/absences (tworzy wniosek)
2. EmployeeService → zapisuje Absence ze status=PENDING
3. EmployeeService → wywołuje AbsenceNotificationService.notifyAdminsOfNewAbsenceRequest()
4. AbsenceNotificationService → wywołuje WebPushService.sendToOrganisationAdmins()
5. WebPushService → pobiera unreadCount dla każdego admina
6. WebPushService → dodaje unreadCount do payload
7. WebPushService → wysyła Web Push do każdego admina
8. Service Worker (admin) → otrzymuje push event
9. Service Worker → pokazuje natywne powiadomienie
10. Service Worker → aktualizuje badge (z unreadCount z payload)
11. Backend → zapisuje Notification w bazie (jeśli używamy historii)
12. Admin klika powiadomienie → aplikacja otwiera /organisation?tab=pending-absences
```

### 8.2 Scenariusz 2: Admin zatwierdza wniosek

```
1. Admin → POST /employees/absences/{id}/approve
2. EmployeeService → zmienia status na APPROVED
3. EmployeeService → wywołuje AbsenceNotificationService.notifyEmployeeOfAbsenceDecision()
4. AbsenceNotificationService → wywołuje WebPushService.sendPushNotification(employeeUserId)
5. WebPushService → pobiera unreadCount dla pracownika
6. WebPushService → wysyła Web Push z unreadCount w payload
7. Service Worker (pracownik) → pokazuje powiadomienie "Twój wniosek został zatwierdzony"
8. Service Worker → aktualizuje badge
9. Pracownik klika → otwiera szczegóły nieobecności
```

### 8.3 Scenariusz 3: Rejestracja subskrypcji push

```
1. Użytkownik loguje się → aplikacja sprawdza Notification.permission
2. Jeśli 'default' → pokazuje NotificationPermission prompt
3. Użytkownik klika "Włącz" → Notification.requestPermission()
4. Jeśli granted:
   a. Pobierz VAPID public key z GET /push-subscriptions/vapid-public-key
   b. pushManager.subscribe() z tym kluczem (konwersja przez urlBase64ToUint8Array)
   c. POST /push-subscriptions z danymi subskrypcji
5. Backend zapisuje PushSubscription powiązaną z zalogowanym użytkownikiem
```

### 8.4 Scenariusz 4: Synchronizacja powiadomień

```
1. Aplikacja startuje → useUnreadCount() pobiera count z GET /notifications/unread-count
2. Store aktualizuje unreadCount
3. badgeApi.setBadge(count) aktualizuje badge
4. Użytkownik otwiera NotificationCenter → useNotifications() pobiera listę z GET /notifications
5. Użytkownik klika powiadomienie → PATCH /notifications/{id}/read
6. Store zmniejsza unreadCount
7. badgeApi.setBadge(nowyCount) aktualizuje badge
```

---

## 9. Plan wdrożenia

### Faza 1: Backend - Fundamenty
1. [ ] Dodanie zależności web-push do Maven
2. [ ] Generowanie i konfiguracja VAPID keys
3. [ ] Enum `AbsenceStatus` + modyfikacja encji `Absence`
4. [ ] Migracja danych: `approved=true` → `APPROVED`, `approved=false` → `PENDING`
5. [ ] Encja `PushSubscription` + repository
6. [ ] Encja `Notification` + repository (opcjonalnie, dla historii)

### Faza 2: Backend - Endpointy
7. [ ] `PushSubscriptionController` (subscribe, unsubscribe, get vapid key)
8. [ ] `PushSubscriptionService`
9. [ ] `NotificationController` (get, mark as read, unread count)
10. [ ] `AbsenceController` - endpointy approve/reject/pending
11. [ ] `AbsenceService` - logika approve/reject

### Faza 3: Backend - Powiadomienia
12. [ ] `WebPushService` - wysyłanie push (z unreadCount w payload)
13. [ ] `AbsenceNotificationService` - triggery
14. [ ] Integracja triggerów w `AbsenceServiceImpl`

### Faza 4: Frontend - Fundamenty
15. [ ] Enum `AbsenceStatusEnum`
16. [ ] Typy (`notification.ts`, zmodyfikowany `Absence.ts`)
17. [ ] Badging API wrapper (`badgeApi.ts`)
18. [ ] Push utils (`pushUtils.ts` - urlBase64ToUint8Array)
19. [ ] Absence utils (`absenceUtils.ts` - helper functions)
20. [ ] Notification Store (Zustand + persist)
21. [ ] API client dla push subscriptions i notifications

### Faza 5: Frontend - UI
22. [ ] Komponent `NotificationBell` z badge'm
23. [ ] Komponent `NotificationCenter` (dropdown)
24. [ ] Komponent `NotificationItem`
25. [ ] Komponent `NotificationPermission`
26. [ ] Komponent `PendingAbsencesDetails`
27. [ ] Komponent `AbsenceItemWithActions` (z przyciskami approve/reject)
28. [ ] Integracja z navbar w `_base.tsx`
29. [ ] Dodanie zakładki "Pending Absences" w `OrganisationPage`
30. [ ] Aktualizacja `AbsenceItem.tsx` (użycie helper functions)

### Faza 6: Frontend - Service Worker
31. [ ] Rozszerzenie `sw.ts` o push event listener
32. [ ] Handler notificationclick
33. [ ] Handler pushsubscriptionchange (odnawianie subskrypcji)
34. [ ] Komunikacja SW ↔ aplikacja (postMessage)
35. [ ] Aktualizacja badge w SW

### Faza 7: Frontend - Integracja
36. [ ] Hook `useNotifications`
37. [ ] Logika rejestracji subskrypcji przy logowaniu
38. [ ] Synchronizacja badge z backendem przy starcie
39. [ ] Aktualizacja widoków absences (nowe statusy, approve/reject)

### Faza 8: Testy i dokumentacja
40. [ ] Testy jednostkowe (backend)
41. [ ] Testy integracyjne (backend)
42. [ ] Testy E2E (frontend)
43. [ ] Dokumentacja API
44. [ ] Dokumentacja użytkownika

---

## 10. Migracja danych

### 10.1 SQL migracja dla Absence

```sql
-- Krok 1: Dodaj kolumnę status (tymczasowo nullable)
ALTER TABLE absences ADD COLUMN status VARCHAR(20);

-- Krok 2: Migruj istniejące dane
UPDATE absences SET status = 'APPROVED' WHERE approved = true;
UPDATE absences SET status = 'PENDING' WHERE approved = false;

-- Krok 3: Ustaw NOT NULL i domyślną wartość
ALTER TABLE absences ALTER COLUMN status SET NOT NULL;
ALTER TABLE absences ALTER COLUMN status SET DEFAULT 'PENDING';

-- Krok 4: Opcjonalnie - dodaj kolumnę rejection_reason
ALTER TABLE absences ADD COLUMN rejection_reason VARCHAR(500) NULL;

-- Krok 5: Po weryfikacji - usuń starą kolumnę approved
-- ALTER TABLE absences DROP COLUMN approved;
```

### 10.2 Migracja frontendu

**Kroki:**
1. Zaktualizować typ `Absence` (usunąć `approved`, dodać `status`)
2. Zaktualizować wszystkie miejsca używające `approved`:
   - `AbsenceItem.tsx` → użyć helper functions
   - `absenceSchema.ts` → zmienić na enum
3. Dodać tłumaczenia dla nowych statusów

---

## 11. Wymagania techniczne

### Backend
- Java 17+ (już spełnione - Java 24)
- Spring Boot 3.x (już spełnione - 3.5.0)
- Biblioteka web-push (nl.martijndwars:web-push:5.1.1)
- PostgreSQL (już używane)

### Frontend
- Przeglądarka z wsparciem Push API i Service Worker
- Serwist (już zainstalowane)
- Zustand (już zainstalowane)

### Wsparcie przeglądarek

| Przeglądarka | Push API | Badging API |
|--------------|----------|-------------|
| Chrome 81+   | Tak      | Tak         |
| Edge 81+     | Tak      | Tak         |
| Firefox 44+  | Tak      | Nie         |
| Safari 16+   | Tak      | Częściowe   |

---

## 12. Konfiguracja środowiska

### Zmienne środowiskowe (backend)

```env
# VAPID keys (wygenerować przez: npx web-push generate-vapid-keys)
VAPID_PUBLIC_KEY=BEl62iUYgUiv...
VAPID_PRIVATE_KEY=UbThDr8V...
```

### Routing przez API Gateway

Dodać w konfiguracji gateway:
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: push-subscriptions
          uri: lb://auth-service
          predicates:
            - Path=/push-subscriptions/**
        - id: notifications
          uri: lb://auth-service
          predicates:
            - Path=/notifications/**
```

---

## 13. Podsumowanie zmian

### Backend
- ✅ Enum `AbsenceStatus` zamiast `boolean approved`
- ✅ Endpointy approve/reject/pending dla absences
- ✅ Encja `PushSubscription` dla Web Push
- ✅ Encja `Notification` dla historii (opcjonalnie)
- ✅ `WebPushService` z `unreadCount` w payload
- ✅ `AbsenceNotificationService` dla triggerów

### Frontend
- ✅ Enum `AbsenceStatusEnum`
- ✅ Helper functions (`isPending`, `isApproved`, `isRejected`)
- ✅ Notification Store (Zustand)
- ✅ Badging API wrapper
- ✅ Push utils (urlBase64ToUint8Array)
- ✅ Service Worker z push handlers
- ✅ Komponenty powiadomień
- ✅ Widok pending absences dla adminów

### Kluczowe decyzje
1. ✅ **Enum zamiast boolean** - czytelniejszy i bardziej rozszerzalny
2. ✅ **unreadCount w payload push** - aktualizacja badge gdy aplikacja zamknięta
3. ✅ **Synchronizacja z backendem** - historia powiadomień i unread count
4. ✅ **pushsubscriptionchange handler** - automatyczne odnawianie subskrypcji
5. ✅ **Pending absences w zakładce Organisation** - zgodnie z obecną strukturą

