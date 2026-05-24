type User = {
  name: string;
  accessToken: string;
  refreshToken: string;
};

// const hasText = (str: string) => str?.trim().length > 0;


export const Home = (props: User) => {

  // const isAccessToken = hasText(props.accessToken);
  // const isRefreshToken = hasText(props.refreshToken);


  return (
    <>
      <h1>Welcome! {props.name}</h1>
    </>
  );
};
