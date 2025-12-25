import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("list/:id", "routes/list.$id.tsx"),
] satisfies RouteConfig;
