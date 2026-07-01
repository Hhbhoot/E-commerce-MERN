export default function asyncHandler(fn) {
  return function (req, res, next) {
    return fn(req, res, next).catch(next);
  };
}
