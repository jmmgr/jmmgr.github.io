# Git

## Branching strategy

### GitFlow
This branching strategy consists of the following branches:

- **master**: Is the main branch that gets deployed. When new changes are merged, a new tag/release is added.
- **release**: Help prepare a new production release. Usually branched from the develop branch and must be merged back to both **develop** and **master**
- **develop**: Branch to merge new features. It gets checkout from the **release** branch.
- **fetures-branch**: These branchs get checkout from the **develop** branch, get features changes, and then get merged back in the **develop**.
- **hotfix**: Get checkout from **master**, get a hotfix change, and get merged back to **master**

![GitFlow](./gitflow-branching-strategy.png)

