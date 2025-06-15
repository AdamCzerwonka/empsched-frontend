import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "EmployeeScheduler" },
    { name: "description", content: "Welcome to EmployeeScheduler!" },
  ];
}

export default function Home() {
  return <div>Hii </div>;
}
