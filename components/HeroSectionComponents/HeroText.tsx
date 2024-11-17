import { Title } from "./Title";
import { Subtitle } from "./Subtitle";
import { Description } from "./Description";

const HeroText = () => {
  return (
    <div className="space-y-4">
      <Title />
      <Subtitle />
      <Description />
    </div>
  );
};

export default HeroText;
