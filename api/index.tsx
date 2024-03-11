import { Button, Frog } from 'frog'
import { neynar } from 'frog/hubs'
import { handle } from 'frog/vercel'
import { getRecommendations } from './dune.js'
import dotenv from 'dotenv';
dotenv.config();

export const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  hub: neynar({ apiKey: process.env["NEYNAR_API"] || '' })
})

app.frame('/', async (c) => {
  const { buttonValue, status, frameData, verified } = c
  const option = buttonValue
  let recs_list: { key: any; value: any; }[];
  console.log("loading...", status, option)

  if (status === 'response' && verified) {
    console.log("running filter", option, frameData?.fid)
    recs_list = await getRecommendations(frameData?.fid);
  }

  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background: 'linear-gradient(to right, #E1E1F9, #FFECEB)',
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
            color: 'black',
            fontSize: 50,
            fontStyle: 'normal',
            letterSpacing: '-0.020em',
            lineHeight: 1.3,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
            display: 'flex',
            flexDirection: 'column',
            fontWeight: 'bold'
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
        </div>
        <div
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '20px',
              display: 'flex',
              flexDirection: 'column',
              width: '150px',
              height: '80px',
            }}
          >
            <img src="https://assets-global.website-files.com/62fca6954348cf2e3c918eee/64ff2a324de75d7cf9cab050_Dune%20logo.svg" alt="Dune Logo" />
          </div>
      </div>
    ),
    intents: [
      status === 'initial'  && <Button value="followers">See From Your Followers</Button>,
      status === 'response' && <Button value={option}>Show More</Button>,
      status === 'response' && <Button.Link href="https://github.com/andrewhong5297/dune-frames">See Frame Code</Button.Link>,
      // (status === 'initial' || (status === 'response' && option === 'followers')) && <Button value="following">Following You</Button>,
      // status === 'response' && <Button.Reset>Back</Button.Reset>,
    ],
  })
})

export const GET = handle(app)
export const POST = handle(app)