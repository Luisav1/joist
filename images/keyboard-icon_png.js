/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';

const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE0AAAA+CAYAAABuv5bfAAAACXBIWXMAABhMAAAYTAGIN/zbAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAttJREFUeNrsW91RwzAMdnu8txsQJqiZoGECyhtvlAmaDSgbZIRuQEYIG4QJCBukb7yFiHPvgisV+fJTJ5XudL24MpI/9Ge7mZRlqUZG24pfas93FadtKpiq8dG8awVjBE0LaM09LW9bwWRkOS2o+NNeo3jaaQ9LrLGPLhRdjSB/hYbvke/TLpQOKTyDGkjwuWTMuekip/nuaQDQ2nxeO8zbVxx1AZjvoMUVbxznQA7bGS66MszX8MSqIOVRqeGkK88aiqdtT3z3bgACoLJzGOerp0Fozayw2yItxVnIR09bWYAdxnJfDPSxuQ2t5y+fAMM8LUSM7pserefvf3JcH5TU8+chp2lTphdK6FQBgjRRAGiBQXEmuLD6wHBqXF8A4xFEYgSeVgoWbt4moLXYcsBlxERYvQ6lTxuspwkJaOfbe87V8fVYytwKZQo/37LlcmLLpNXfW6aCOOEIDP9nI7YWysZjKnEKoahanCFyESIXI3IJIhchcgUipwkbNSJbMG1MmDZuMcUu4bkg/mOYV3DksLEZU67p/LmDHslpUggGABp28Zq1PIbpgMKwt8b2RMHg2thb9QytfEVVsEgdH0unxBnVrZVLMgI0bVVFqspybewNtELxb6y5ctwFUSA1sVFymhQCAe2yQdvBBoLBK2TuCpGLiW1QYcllJ/JhXa5AtlDK6LF1L/sC7YkppxuMBUhXv2DuUGYEaFrCU3La+EHbjxwL9k+zXJpbTeQMTsMaI01nTjTFd8zF3CInE1hju25gd2PQuF35UHcTktOkEAhowyeXnBYjjWKE5Ja1YV+Ia+POcKugbYjtEWbQ0iPQXGzcSXhKThPQLqYQPCCFICYS78qjNXJtTLoALWH+4Uyd6aUIB2pko4SngCagDa4QQPMXCjw4BvJDZXf6gvD8EBycKAVPg37lTbBgERz566npvZ4FDxZgv+/F11+SDRX/PP3SKDM7ixwefgQYAIqW2LtFfuBbAAAAAElFTkSuQmCC';
export default image;