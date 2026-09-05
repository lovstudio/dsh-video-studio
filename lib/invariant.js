var name = "video-studio-invariant";
var inject = ["videoStudio"];
function apply(ctx) {
  const runtime = ctx.get("videoStudio");
  runtime.jobs.assertInvariant();
}
export { apply, inject, name };
