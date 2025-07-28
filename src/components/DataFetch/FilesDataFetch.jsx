import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setDownloadErrorMsg, setDownloadStatus, setIs_DownloadError } from "../../features/Files/FilesSlice";
import axios from "axios";
import { POST_DATA_DOWNLOAD } from "../../Public/APIUrl";

export default function FilesDataFetch() {
    const dispatch = useDispatch()
    const { is_clickButton, is_csv, is_json, downloadStatus,
        isDownloadError, DownloadErrorMsg,
        selectedCollection, isSelectAll, startTime, endTime } = useSelector(state => state.files)
    useEffect(() => {
        if (is_clickButton != true || downloadStatus != "no") return
        dispatch(setDownloadStatus("downloading"))
        const payload = {
            'CSVFile': is_csv,
            'JSONFile': is_json,
            'collection': selectedCollection,
            'startTime': startTime,
            'endTime': endTime,
        }
        axios.post(POST_DATA_DOWNLOAD, payload, {
            responseType: 'blob'
        })
            .then(res => {
                const blob = new Blob([res.data], { type: 'application/zip' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'CollectionDataExport.zip'
                a.click()
                URL.revokeObjectURL(url)
            })
            .catch(() => {
                dispatch(setIs_DownloadError(true))
                dispatch(setDownloadErrorMsg('下載失敗，請稍後再試'))
            })
        dispatch(setDownloadStatus('done'))
    }, [is_clickButton])
}