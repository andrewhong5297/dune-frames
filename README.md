## Dune Recommender Frame

Given a user interaction with the frame, filter on results of a pre-run Dune query of all recommendations for just that user's fid. Then return a random set of recommended users as results in the frame.

Here's a link to a [cast using this frame](https://warpcast.com/~/conversations/0x62b84d8405fe6e9ff1639055852d98f910b4c595)

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

Have questions? [Reach out to me](https://warpcast.com/ilemi)