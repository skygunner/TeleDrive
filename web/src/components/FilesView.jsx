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

const FilesView = () => {
  const foldersOffset = useRef(0);
  const folderListEnd = useRef(false);
  const filesOffset = useRef(0);
  const dataSource = useRef([]);

  const [loading, setLoading] = useState(false);
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);

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

      foldersOffset.current += folders.length;
      dataSource.current = dataSource.current.concat(folders);
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
      filesOffset.current += files.length;
      dataSource.current = dataSource.current.concat(files);
    }

    setLoading(false);
  };

  useEffect(() => {
    // https://github.com/ant-design/ant-design/issues/5904#issuecomment-660817725
    const table = document.querySelector(".files-view-table .ant-table-body");
    if (table) {
      table.addEventListener("scroll", async () => {
        const percent =
          (table.scrollTop / (table.scrollHeight - table.clientHeight)) * 100;
        if (percent >= 100) {
          await fetchData();
        }
      });
    }

    window.addEventListener("resize", () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    });

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

  return (
    <Row align="middle">
      <Col offset={1} span={22}>
        <Table
          className="files-view-table"
          columns={columns}
          rowKey={rowKey}
          loading={loading}
          dataSource={dataSource.current}
          pagination={false}
          scroll={{
            scrollToFirstRowOnChange: false,
            y: windowSize[1],
          }}
        />
      </Col>
    </Row>
  );
};

export default FilesView;
