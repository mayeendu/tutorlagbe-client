import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/courses",
        has: [{ type: "query", key: "mode", value: "Physical" }],
        destination: "/tuitions?mode=Offline",
        permanent: true,
      },
      { source: "/courses", destination: "/tuitions", permanent: true },
    ]
  },
}
export default nextConfig
