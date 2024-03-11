## Dune Recommender Frame

Given a user interaction with the frame, filter on results of a pre-run Dune query of all recommendations for just that user's fid. Then return a random set of recommended users as results in the frame.

Important Resources:
- [Followers Recommendation Query](https://dune.com/queries/3509966)
- [Farcaster User Stats Query](https://dune.com/queries/3418402)
- [Dune API Usage Docs](https://docs.dune.com/api-reference/executions/execution-object)

### Running Locally

Fill in secrets within the `.env` file

```
npm install
npm run dev
```

Head to http://localhost:5173/api