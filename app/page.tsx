export default function Home() {
    return <>
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
