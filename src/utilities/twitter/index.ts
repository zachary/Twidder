import { IncomingMessage } from "http";
import { TwitterApi } from "twitter-api-v2";
// import Twit from "twit"

// Instantiate with desired auth type (here's Bearer v2 auth)
const getTwitterClient = () => {
    console.log("Hello")
    const apiKey : string = process.env.TWITTER_API_KEY || "";
    const consumer_secret : string = process.env.TWITTER_API_SECRET || "";
    const access_token : string = process.env.TWITTER_ACCESS_TOKEN || "";
    const access_token_secret : string = process.env.TWITTER_TOKEN_SECRET || "";
    const bearerToken : string = process.env.TWITTER_BEARER_TOKEN || "";
    const client = new TwitterApi({
        appKey : apiKey,
        appSecret : consumer_secret,
        accessToken : access_token,
        accessSecret : access_token_secret
      });
      
      const bearer = new TwitterApi(bearerToken);
      
      const twitterClient = client.readWrite;
      const twitterBearer = bearer.readOnly;
      
      return {
        readWrite : twitterClient,
        readOnly : twitterBearer
      }
      
}

/*

Response.data : {
  edit_history_tweet_ids: [ '1771762738110320706' ],
  id: '1771762738110320706',
  text: 'Hello, from Twidderly : My NextJS APP!!\n' +
    "    Don't forget to follow me : https://t.co/o9AEP4iQUX"
}
*/
const postTweet = async ({post} : {post : string}) => {
   const {readWrite} = getTwitterClient();
   try {
    const response = await readWrite.v2.tweet(post);
    return response.data;

   } catch (error) {
    console.log(error)
    return error;
   }
}

export default getTwitterClient;
export {postTweet}
