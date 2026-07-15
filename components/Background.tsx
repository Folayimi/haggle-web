import Particles from "./ui/particles";

const Background = () => {
  return (
    <>
      <div className="w-[100vw] h-[100vh] fixed top-0">
        <Particles
          particleColors={["#ffffff"]}
          particleCount={150}
          particleSpread={30}
          speed={0.1}
          particleBaseSize={150}
          moveParticlesOnHover
          alphaParticles={true}
          disableRotation={false}
          pixelRatio={1}
        />
      </div>
    </>
  );
};

export default Background;
