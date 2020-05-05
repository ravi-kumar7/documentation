# FinBox Documentation

Holds the documentation for FinBox SDK

## Setting up locally
Make sure `yarn` and `node` are installed on your system. Just navigate to the repository directory then and run the following command:
```bash
yarn install
```
To run it locally:
```bash
yarn docs:dev
```

## Adding or modifying articles
- This documentation is written using VuePress with the default theme. All articles are written in markdown format. Please refer to the [official documentation](https://vuepress.vuejs.org/guide/) of VuePress to see more about advanced features or configurations.
- Create a branch from `master`, make the changes or add an article and then raise a pull request asking for a review to merge it to the `master` branch.
- As soon as the changes are reviewed and the branch is merged to `master`, the GitHub pages will update automatically.
