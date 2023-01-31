import { FileOutlined, FolderOutlined } from "@ant-design/icons";
import { Col, Image, Row, Table } from "antd";
import React, { useEffect, useState } from "react";

import { get, getAuthHeaders } from "../api/utils";
import { humanReadableDate, humanReadableSize } from "../utils/utils";

const FilesView = () => {
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [filesOffset, setFilesOffset] = useState(0);
  const [foldersOffset, setFoldersOffset] = useState(0);
  const [folderListEnd, setFolderListEnd] = useState(false);

  const limit = 20;
  const parentId = null; // Query string
  const authHeaders = getAuthHeaders();

  const fetchData = async () => {
    setLoading(true);

    let folders = [];
    let files = [];

    if (!folderListEnd) {
      let url = `/v1/tdlib/folders?offset=${foldersOffset}&limit=${limit}`;
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
              <div>
                <FolderOutlined style={{ marginRight: 10 }} />
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

      let url = `/v1/tdlib/files?offset=${filesOffset}&limit=${filesLimit}`;
      if (parentId) {
        url += `&parent_id=${parentId}`;
      }

      files = await get(url, authHeaders);
      if (files) {
        files = files.map((file) => {
          return {
            data: file,
            type: "file",
            name: (
              <div>
                {file.thumbnail ? (
                  <Image
                    style={{ maxHeight: 20, maxWidth: 30 }}
                    preview={false}
                    src={file.thumbnail}
                  />
                ) : (
                  <FileOutlined />
                )}
                <span style={{ marginLeft: 10 }}>{file.file_name}</span>
              </div>
            ),
            size: humanReadableSize(file.file_size, true),
            modified: humanReadableDate(file.updated_at),
          };
        });
      }

      setFolderListEnd(true);
      setFoldersOffset(foldersOffset + folders.length);
      setFilesOffset(filesOffset + files.length);
      setDataSource(dataSource.concat(folders).concat(files));
    } else {
      setFoldersOffset(foldersOffset + limit);
      setDataSource(dataSource.concat(folders));
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
      width: "30%",
    },
    {
      title: "Modified",
      dataIndex: "modified",
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
          columns={columns}
          rowKey={rowKey}
          loading={loading}
          dataSource={dataSource}
          pagination={false}
        />
      </Col>
    </Row>
  );
};

export default FilesView;
