import { Composition, registerRoot } from "remotion";
import { createProject, durationInFrames } from "../core/project";
import { StudioComposition } from "./StudioComposition";

const project = createProject();
function Root() {
  return (
    <Composition
      id="Studio"
      component={StudioComposition}
      defaultProps={{ project }}
      width={project.width}
      height={project.height}
      fps={project.fps}
      durationInFrames={durationInFrames(project)}
      calculateMetadata={({ props }) => ({
        width: props.project.width,
        height: props.project.height,
        fps: props.project.fps,
        durationInFrames: durationInFrames(props.project),
      })}
    />
  );
}
registerRoot(Root);
