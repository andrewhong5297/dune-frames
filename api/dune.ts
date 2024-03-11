import dotenv from 'dotenv';
dotenv.config();

import { QueryParameter, DuneClient } from "@cowprotocol/ts-dune-client";
import { Headers } from 'node-fetch';
import fetch from 'node-fetch';

const DUNE_API_KEY = process.env["DUNE_API_KEY"];

export async function getRecommendations(fid: number) {
    //schedule the query on a 6 hour interval, and then fetch by filtering for the user fid within the query results
    //dune query: https://dune.com/queries/3509966
    const meta = {
        "x-dune-api-key": DUNE_API_KEY || ""
    };
    const header = new Headers(meta);
    const latest_response = await fetch(`https://api.dune.com/api/v1/query/3509966/results?&filters=query_fid=${fid}`
    , {
        method: 'GET',
        headers: header,
    });

    const body = await latest_response.text();
    const recs = JSON.parse(body).result.rows[0]; //will only be one row in the result, for the filtered fid
    delete recs.query_fid; //pop off the query_fid column that was used for filtering
    console.log(recs);

    //return four random categories (keys) and users (values) from the recs result
    const keys = Object.keys(recs);
    const randomPairs = [];
    const selectedKeys = new Set();
    while (randomPairs.length < 4 && selectedKeys.size < keys.length) {
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        if (!selectedKeys.has(randomKey)) {
            const randomValue = recs[randomKey][Math.floor(Math.random() * recs[randomKey].length)];
            randomPairs.push({ key: randomKey, value: randomValue });
            selectedKeys.add(randomKey);
        }
    }

    console.log(randomPairs);
    
    return randomPairs
}