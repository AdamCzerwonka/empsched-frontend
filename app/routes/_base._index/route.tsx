import type { Route } from "../../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "EmployeeScheduler" },
    { name: "description", content: "Welcome to EmployeeScheduler!" },
  ];
}

export default function Home() {
  return (
    <div className="text-center">
      <h1>Welcome to / Witamy w EmployeeScheduler!</h1>
    </div>
  );
}
