# Balancer Ops Frontend

DAO operations and governance tool for the Balancer protocol. Part of the [Balancer](https://github.com/balancer) tooling suite.

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/balancer/balancer-ops-frontend)

## Features

- **Payload Builder** — Compose multi-operation governance payloads (fee changes, gauge management, payments, permissions) with Tenderly simulation and GitHub PR submission
- **Rewards Injector Management** — Monitor and configure V1/V2 injector programs across networks
- **Gauge Creator** — Create and enable veBAL gauges
- **Liquidity Buffers** — Initialize and manage liquidity buffers
- **Protocol Monitoring** — Dashboards for boosted pools, injectors, and reward tokens

Supports 15+ networks including Mainnet, Arbitrum, Base, Polygon, Optimism, Gnosis, Avalanche, and more.

## Setup

1. Clone and install dependencies:
   ```bash
   git clone https://github.com/balancer/balancer-ops-frontend.git
   cd balancer-ops-frontend
   yarn install
   ```

2. Create `.env.local` with required variables:
   ```env
   # Balancer API
   NEXT_PUBLIC_BALANCER_API_URL=https://api-v3.balancer.fi/

   # RPC Provider
   NEXT_PUBLIC_DRPC_API_KEY=your_drpc_key
   DRPC_API_KEY=your_drpc_key

   # Wallet Connect
   NEXT_PUBLIC_WALLET_CONNECT_ID=your_walletconnect_project_id

   # External APIs
   DUNE_API_KEY=your_dune_key
   GRAPH_API_KEY=your_graph_key
   TENDERLY_KEY=your_tenderly_key

   # GitHub OAuth (for PR creation)
   AUTH_GITHUB_ID=your_github_oauth_app_id
   AUTH_GITHUB_SECRET=your_github_oauth_app_secret

   # Database & Security
   DATABASE_URL=postgresql://user:password@localhost:5432/balancer_ops
   ENCRYPTION_KEY=your_32_char_encryption_key
   ```

3. Start the development server:
   ```bash
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000)

## Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start dev server with Turbopack |
| `yarn build` | Production build |
| `yarn lint` | Run ESLint |
| `yarn lint:fix` | Fix lint issues + format with Prettier |
| `yarn gen:graphql:dev` | Regenerate GraphQL types (dev) |

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: Chakra UI v2
- **Data**: Apollo Client (GraphQL), React Query, Prisma (PostgreSQL)
- **Web3**: Wagmi v2, Viem, RainbowKit, Ethers v6
- **Auth**: NextAuth with GitHub OAuth