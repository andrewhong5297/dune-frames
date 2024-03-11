import dotenv from 'dotenv';
dotenv.config();

import { QueryParameter, DuneClient } from "@cowprotocol/ts-dune-client";
import { Headers } from 'node-fetch';
import fetch from 'node-fetch';

const DUNE_API_KEY = process.env["DUNE_API_KEY"];

export async function get_address_data(address: string) {
    // try latest, and then refresh if latest doesn't work. TODO: add latest results endpoint to sdk
    // eas dune query: https://dune.com/queries/3389839
    let results = null
    try{
        const meta = {
            "x-dune-api-key": DUNE_API_KEY || ""
        };
        const header = new Headers(meta);
        const latest_response = await fetch(`https://api.dune.com/api/v1/query/3389839/results?params.cast_hash=${address}`, {
            method: 'GET',
            headers: header,
        });

        const body = await latest_response.text();
        //if execution is stale, refresh it
        const executionEndedAt = JSON.parse(body).execution_ended_at;
        const minuteAgo = new Date(Date.now() - 3 * 60 * 1000).toISOString();
        if (executionEndedAt < minuteAgo) {
            throw new Error("Execution ended more than three minutes ago.");
        } else {
            results = JSON.parse(body)?.result?.rows[0].results;
            if (results == null) {
                throw new Error(body);
            }
        }
    } catch (error) {
        console.log(error)
        const client = new DuneClient(DUNE_API_KEY ?? "");
        const queryID = 3389839;
        const parameters = [
            QueryParameter.text("cast_hash", address)
        ];

        const response = await client.refresh(queryID, parameters)
        results = response?.result?.rows[0].results
    }
}