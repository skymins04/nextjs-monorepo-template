# PNPM Monorepo Template

```sh
# 패키지 설치
pnpm install

# 모노레포 빌드
pnpm build

# 모노레포 개발환경 실행
pnpm dev

# 모노레포 Local SSL Proxy 실행 (localhost 인증서를 이미 생성한 경우 생략 가능)
mkcert localhost && pnpm proxy

# 모노레포 내 Next.js 앱 추가
pnpm create:next

# 모노레포 내 모든 node_modules/ 제거
pnpm remove:node-modules

# 모노레포 내 모든 .next/ 제거
pnpm remove:next-build
```
