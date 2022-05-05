export default function enforceApiRouteSecret(req, res) {
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    res.status(401).send('You are not authorized to make this call');
    return false;
  }

  return true;
}
