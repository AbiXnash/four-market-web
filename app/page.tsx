"use client";

import { useAppStatus } from "@/lib/app-status";
import api from "@/lib/client-api";
import { useEffect } from "react";

export default function Home() {
    const status = useAppStatus();

    useEffect(() => {
        api.get("/api/check/app")
            .then((res) => {
                if (res.data) console.log(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    return <>
        {status === "offline" && (
            <div style={{ background: "red", color: "white", padding: "0.5rem", textAlign: "center" }}>
                Backend is offline
            </div>
        )}

        <h1> Welcome Back! </h1>

        <form>
            <label htmlFor="username">Username: </label>
            <input id="username" type="text" />
            <br />

            <label htmlFor="password">Password: </label>
            <input id="password" type="password" />
            <br />

            <input type="submit" value="Submit" />

        </form>

    </>
}
