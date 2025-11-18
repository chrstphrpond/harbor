# Harbor Repository Structure

root
  frontend
    pages
    components
    styles
    utils

  backend
    src
      auth
      tenants
      files
      metrics
      insights
      automations
      audit
      common
    main.ts

  workers
    queues
    jobs
      processFile
      generateInsights
      evaluateAutomations

  infra
    docker
    scripts

  docs
    mvp.md
    prd.md
    architecture.md
    api.md
    schema.md

  .github
    workflows
      ci.yml
      cd.yml
