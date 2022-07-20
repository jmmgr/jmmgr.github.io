# Git

## Branching strategy

### Github Flow
- **master**: Is the main branch that gets deployed. 
- **fetures-branch**: These branchs get checkout from the **master** branch, get features changes, and then get merged back in the **master**.

Good: fast deliveries, easy to debug, good for CI/CD.
Bad: suited for small teams, easier to push bugs to production.

![Github Flow](./github-flow-branching-model.jpeg)

### GitFlow
This branching strategy consists of the following branches:

- **master**: Is the main branch that gets deployed. When new changes are merged, a new tag/release is added.
- **release**: Help prepare a new production release. Usually branched from the develop branch and must be merged back to both **develop** and **master**
- **develop**: Branch to merge new features. It gets checkout from the **release** branch.
- **fetures-branch**: These branchs get checkout from the **develop** branch, get features changes, and then get merged back in the **develop**.
- **hotfix**: Get checkout from **master**, get a hotfix change, and get merged back to **master**

Good: allow work in parallel
Bad: complex and slow, deploy too many changes at the same time(difficult to debug), difficult with CI/CD

![GitFlow](./gitflow-branching-strategy.png)

### GitLab Flow
[GitLab Flow] (https://docs.gitlab.com/ee/topics/gitlab_flow.html#production-branch-with-gitlab-flow)

In Github Flow, if CD is not available, users won't know what is in production (difficult to know if the changes has been deployed yet).
GitLab Flow will have an extra branch **production**, which will only have the deployed changes.
As well, there can be other branches that show the state of other environments.

Is good when there can't be CD, and there is no control the time of the release.

![GitLab Flow](./gitlab_flow_environment_branches.png)

### Trunk based development

Trunk bases development doesn't use branches. Developers just commit to the **trunk** branch and deploy with CD.

The idea is to deliver fast, so most of the time you will need feature flags (to disable half baked feautures).
