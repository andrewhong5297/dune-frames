import { Button, Frog } from 'frog'
import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'
import { getRecommendations } from './dune'
import duneLogo from './images/dune_logo.png';
import dotenv from 'dotenv';
dotenv.config();

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  // Supply a Hub to enable frame verification.
  hub: neynar({ apiKey: process.env["NEYNAR_API"] || '' })
})

/*
App flow
- See the top users from... (include a bunch of emojis of the different sections)
  - click "following" or "followers"
- show stats page
  - show 4 random categories (2 onchain, 2 engagement), then a random 1 from the array
  - button to show new ones
  - button to see followers (or following)
  - redirect button to the github repo
*/

app.frame('/', async (c) => {
  const { buttonValue, status, frameData, verified } = c
  const option = buttonValue
  let recs_list: { key: any; value: any; }[];
  console.log("loading...", status, option)

  if (status === 'response' && verified) {
    console.log("running filter", option, frameData?.fid)
    recs_list = await getRecommendations(16522);
  }

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(to right, #432889, #17101F)',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {status === 'response'
            ? option 
              ? 
                recs_list.map((result) => (
                  <div style={{ textAlign: 'right' }}>
                    {`${result.key}: ${result.value}`}
                  </div>))
              : ''
            : `See recomended users by persona\n\n 🤗⛓💻📈👟💎🥇👂📡`}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
            }}
          >
            <img src={duneLogo} alt="Dune Logo" />
          </div>
        </div>
      </div>
    ),
    intents: [
      status === 'initial'  && <Button value="followers">See From Your Followers</Button>,
      status === 'response' && <Button value={option}>Show More</Button>,
      status === 'response' && <Button.Link href="https://github.com/andrewhong5297/dune-frames">See Code</Button.Link>,
      // (status === 'initial' || (status === 'response' && option === 'followers')) && <Button value="following">Following You</Button>,
      // status === 'response' && <Button.Reset>Back</Button.Reset>,
    ],
  })
})

export const GET = handle(app)
export const POST = handle(app)