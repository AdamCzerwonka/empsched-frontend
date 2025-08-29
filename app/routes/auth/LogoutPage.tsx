import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { LoadingButton, Card, CardContent } from "~/components/ui";
import { navigation } from "~/constants";
import { useAuthStore } from "~/store";

export const LogoutPage = () => {
  const { t } = useTranslation("routes/auth/logoutPage");
  const { clearToken } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    clearToken();
    navigate(navigation.home);
  }, []);

  return (
    <Card>
      <CardContent>
        <LoadingButton
          disableButton={true}
          isLoading={true}
          children={<span>{t("information")}</span>}
          variant={"ghost"}
        />
      </CardContent>
    </Card>
  );
};

export default LogoutPage;
