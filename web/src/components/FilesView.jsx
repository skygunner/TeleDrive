import { FolderOutlined } from "@ant-design/icons";
import { Col, Row, Table } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { FileIcon, defaultStyles } from "react-file-icon";

import { get, getAuthHeaders } from "../api/utils";
import {
  fileExtension,
  humanReadableDate,
  humanReadableSize,
} from "../utils/utils";
import RefWrap from "./RefWrap";

const FilesView = () => {
  const foldersOffset = useRef(0);
  const folderListEnd = useRef(false);
  const filesOffset = useRef(0);
  const dataSource = useRef([]);

  const [loading, setLoading] = useState(true);

  const limit = 20;
  const parentId = null; // Query string
  const authHeaders = getAuthHeaders();

  const fetchData = async () => {
    setLoading(true);

    let folders = [];
    let files = [];

    if (!folderListEnd.current) {
      let url = `/v1/tdlib/folders?offset=${foldersOffset.current}&limit=${limit}`;
      if (parentId) {
        url += `&parent_id=${parentId}`;
      }

      folders = await get(url, authHeaders);
      if (folders) {
        folders = folders.map((folder) => {
          return {
            data: folder,
            type: "folder",
            name: (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ maxWidth: 36, marginRight: 10 }}>
                  <FolderOutlined style={{ fontSize: 38, padding: "6px 0" }} />
                </div>
                <a href="https://google.com">{folder.folder_name}</a>
              </div>
            ),
            size: "-",
            modified: humanReadableDate(folder.updated_at),
          };
        });
      }
    }

    if (folders.length < limit) {
      const filesLimit = limit - folders.length;

      let url = `/v1/tdlib/files?offset=${filesOffset.current}&limit=${filesLimit}`;
      if (parentId) {
        url += `&parent_id=${parentId}`;
      }

      files = await get(url, authHeaders);
      if (files) {
        files = files.map((file) => {
          const extension = fileExtension(file.file_name);

          return {
            data: file,
            type: "file",
            name: (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ maxWidth: 36, marginRight: 10 }}>
                  <FileIcon
                    labelUppercase={true}
                    extension={extension}
                    {...defaultStyles[extension]}
                  />
                </div>
                <span>{file.file_name}</span>
              </div>
            ),
            size: humanReadableSize(file.file_size, true),
            modified: humanReadableDate(file.updated_at),
          };
        });
      }

      folderListEnd.current = true;
      foldersOffset.current += folders.length;
      filesOffset.current += files.length;
      dataSource.current = dataSource.current.concat(folders).concat(files);
    } else {
      foldersOffset.current += limit;
      dataSource.current = dataSource.current.concat(folders);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "40%",
    },
    {
      title: "Size",
      dataIndex: "size",
      responsive: ["md"],
      width: "30%",
    },
    {
      title: "Modified",
      dataIndex: "modified",
      responsive: ["sm"],
      width: "30%",
    },
  ];

  const rowKey = (row) => {
    if (row.type === "file") {
      return row.data.file_id;
    } else if (row.type === "folder") {
      return row.data.id;
    }
  };

  const setRef = (ref) => {
    if (ref) {
      const tbody = ref.querySelector(".ant-table-body");
      if (tbody)
        tbody.addEventListener("scroll", async (event) => {
          let maxScroll = event.target.scrollHeight - event.target.clientHeight;
          let currentScroll = event.target.scrollTop;
          if (currentScroll === maxScroll) {
            await fetchData();
          }
        });
    }
  };

  return (
    <Row align="middle">
      <Col offset={1} span={22}>
        <RefWrap setRef={setRef}>
          <Table
            columns={columns}
            rowKey={rowKey}
            loading={loading}
            dataSource={dataSource.current}
            pagination={false}
            scroll={{
              scrollToFirstRowOnChange: false,
              y: 240,
            }}
          />
        </RefWrap>
      </Col>
    </Row>
  );
};

export default FilesView;
