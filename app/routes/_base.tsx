import GlobalLayout from "~/components/layout/GlobalLayout";
import Layout from "~/components/layout/Layout";

export const BaseLayout = () => {
  return (
    <GlobalLayout>
      <Layout />
    </GlobalLayout>
  );
};

export default BaseLayout;
