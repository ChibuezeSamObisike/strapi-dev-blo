import { LineWave } from "react-loader-spinner";

const Loader = () => {
  return (
    <LineWave
      visible={true}
      height="150"
      width="150"
      color="#7e22ce"
      ariaLabel="line-wave-loading"
      wrapperStyle={{}}
    />
  );
};

export default Loader;
