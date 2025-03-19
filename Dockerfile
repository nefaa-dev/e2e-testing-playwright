FROM mcr.microsoft.com/playwright:v1.44.1-jammy

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /e2e-tests

RUN pnpm dlx playwright install --with-deps chromium && \
    pnpm install -g @cucumber/cucumber

COPY package.json pnpm-lock.yaml ./

RUN --mount=type=cache,id=pnpm,target=${PNPM_HOME} \
    pnpm install --frozen-lockfile

COPY . ./

CMD ["pnpm", "test"]