//------ Global URL ------//
const HTTP_PROTOCOL = "https"
const WEBSOCKET_PROTOCOL = "wss"
const HOST = "bms-capstone-project-backend.onrender.com"
const WEBSITE_PORT = ""
const API_PORT = ""
const WEBSITE_URL = `${HTTP_PROTOCOL}://${HOST}${WEBSITE_PORT}`
const HTTP_API_URL = `${HTTP_PROTOCOL}://${HOST}${API_PORT}`
const WS_API_URL = `${WEBSOCKET_PROTOCOL}://${HOST}${API_PORT}`
//------ Global Route ------//
const WS_SUBSCRIBE_CHANGE = WS_API_URL + "/ws/SubscribeChange"
const GET_THRESHOLD = HTTP_API_URL + "/getData_threshold"
//------ Home Page URL ------//
const GET_NEWEST_MEAN_DATA = HTTP_API_URL + "/getData_newest_mean"
const GET_CELL_ALL_DATA = HTTP_API_URL + "/getData_AllCells"
//------ Analytics Page URL ------//
const POST_GRATH_DATA = HTTP_API_URL + "/getData_graph"
const GET_ANALYTICS_DATA = HTTP_API_URL + "/getData_analytics"
//------ Annomaly Page URL ------//
const POST_ANNOMALY_DATA = HTTP_API_URL + "/getData_annomaly"
const POST_LOAD_MORE_ANNOMALY_DATA = HTTP_API_URL + "/getData_loadMoreAnnomaly"
//------ files download URL ------//
const POST_DATA_DOWNLOAD = HTTP_API_URL + "/get/File"
//------ Setting Page URL ------//
const PUT_THRESHOLD_DATA = HTTP_API_URL + "/updateData_threshold"
const PUT_CHANGE_PASSWORD = HTTP_API_URL + "/updateUser_password"
//------ Login Page URL ------//
const POST_LOGIN = HTTP_API_URL + "/login"
//------ Notification Block URL ------//
const GET_NOTIFICATION_DATA = HTTP_API_URL + "/get/notification"
const PUT_TURN_READ = HTTP_API_URL + "/put/TurnRead"
const POST_LOAD_MORE_NOTIFICATION_DATA = HTTP_API_URL + "/post/notification/loadmore"
//------ Check User ------//
const POST_CHECKUSER = HTTP_API_URL + "/protected"
export { 
    WEBSITE_URL, HTTP_API_URL, WS_API_URL, 
    WS_SUBSCRIBE_CHANGE, GET_THRESHOLD,
    GET_NEWEST_MEAN_DATA, GET_CELL_ALL_DATA,
    POST_GRATH_DATA, GET_ANALYTICS_DATA,
    POST_ANNOMALY_DATA, POST_LOAD_MORE_ANNOMALY_DATA,
    POST_DATA_DOWNLOAD,
    PUT_THRESHOLD_DATA, PUT_CHANGE_PASSWORD, 
    POST_LOGIN,
    GET_NOTIFICATION_DATA, PUT_TURN_READ, POST_LOAD_MORE_NOTIFICATION_DATA,
    POST_CHECKUSER
}