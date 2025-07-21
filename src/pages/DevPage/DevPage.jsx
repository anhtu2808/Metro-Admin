import React, { useState, useEffect } from 'react';
import { Card, Button, Typography, Space, Divider, message, Tag, Row, Col, Input } from 'antd';
import { CopyOutlined, ReloadOutlined, EyeOutlined, EyeInvisibleOutlined, CodeOutlined } from '@ant-design/icons';
import './DevPage.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const DevPage = () => {
  const [tokenVisible, setTokenVisible] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [apiEndpoints, setApiEndpoints] = useState({
    base: 'http://localhost:8080/api',
    auth: '/auth',
    stations: '/stations',
    lines: '/lines',
    users: '/users'
  });

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('accessToken') || localStorage.getItem('token') || 'No token found';
  };

  // Get user info from localStorage
  const getUserInfo = () => {
    try {
      const userStr = localStorage.getItem('user') || localStorage.getItem('userInfo');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  };

  // Copy to clipboard function
  const copyToClipboard = (text, label = 'Text') => {
    navigator.clipboard.writeText(text).then(() => {
      message.success(`${label} copied to clipboard!`);
    }).catch(() => {
      message.error('Failed to copy to clipboard');
    });
  };

  // Refresh data
  const refreshData = () => {
    setUserInfo(getUserInfo());
    message.success('Data refreshed!');
  };

  useEffect(() => {
    setUserInfo(getUserInfo());
  }, []);

  const token = getToken();
  const maskedToken = token.length > 20 ? 
    token.substring(0, 10) + '••••••••••••••••••••' + token.substring(token.length - 10) : 
    token;

  return (
    <div className="dev-page">
      <div className="dev-page-header">
        <Space align="center">
          <CodeOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <Title level={2} style={{ margin: 0 }}>Developer Tools</Title>
          <Tag color="orange">DEV MODE</Tag>
        </Space>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={refreshData}
          type="default"
        >
          Refresh
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Authentication Token */}
        <Col xs={24} lg={12}>
          <Card 
            title="🔐 Authentication Token" 
            className="dev-card"
            extra={
              <Button
                icon={tokenVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                onClick={() => setTokenVisible(!tokenVisible)}
                size="small"
              >
                {tokenVisible ? 'Hide' : 'Show'}
              </Button>
            }
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <div className="token-display">
                <TextArea
                  value={tokenVisible ? token : maskedToken}
                  readOnly
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  className="token-textarea"
                />
              </div>
              <Button 
                type="primary" 
                icon={<CopyOutlined />}
                onClick={() => copyToClipboard(token, 'Token')}
                block
              >
                Copy Token
              </Button>
              <div className="token-info">
                <Text type="secondary">Length: {token.length} characters</Text>
                <br />
                <Text type="secondary">
                  Status: {token === 'No token found' ? 
                    <Tag color="red">Not Found</Tag> : 
                    <Tag color="green">Available</Tag>
                  }
                </Text>
              </div>
            </Space>
          </Card>
        </Col>

        {/* User Information */}
        <Col xs={24} lg={12}>
          <Card title="👤 User Information" className="dev-card">
            {userInfo ? (
              <Space direction="vertical" style={{ width: '100%' }}>
                <div className="user-info">
                  <Paragraph>
                    <Text strong>ID:</Text> {userInfo.id || 'N/A'}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Username:</Text> {userInfo.username || userInfo.email || 'N/A'}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Role:</Text> {userInfo.role || 'N/A'}
                  </Paragraph>
                  <Paragraph>
                    <Text strong>Email:</Text> {userInfo.email || 'N/A'}
                  </Paragraph>
                </div>
                <Button 
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(JSON.stringify(userInfo, null, 2), 'User Info')}
                  block
                >
                  Copy User JSON
                </Button>
              </Space>
            ) : (
              <div className="no-data">
                <Text type="secondary">No user information found in localStorage</Text>
              </div>
            )}
          </Card>
        </Col>

        {/* API Endpoints */}
        <Col xs={24} lg={12}>
          <Card title="🌐 API Endpoints" className="dev-card">
            <Space direction="vertical" style={{ width: '100%' }}>
              {Object.entries(apiEndpoints).map(([key, endpoint]) => (
                <div key={key} className="endpoint-item">
                  <div className="endpoint-label">
                    <Text strong>{key.toUpperCase()}:</Text>
                  </div>
                  <div className="endpoint-value">
                    <Input 
                      value={key === 'base' ? endpoint : `${apiEndpoints.base}${endpoint}`}
                      readOnly
                      size="small"
                      addonAfter={
                        <Button 
                          size="small" 
                          icon={<CopyOutlined />}
                          onClick={() => copyToClipboard(
                            key === 'base' ? endpoint : `${apiEndpoints.base}${endpoint}`,
                            `${key.toUpperCase()} Endpoint`
                          )}
                        />
                      }
                    />
                  </div>
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={12}>
          <Card title="⚡ Quick Actions" className="dev-card">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button 
                block 
                onClick={() => copyToClipboard(`Bearer ${token}`, 'Authorization Header')}
              >
                Copy Authorization Header
              </Button>
              <Button 
                block 
                onClick={() => copyToClipboard(JSON.stringify({
                  token,
                  user: userInfo,
                  endpoints: apiEndpoints
                }, null, 2), 'Full Debug Info')}
              >
                Copy All Debug Info
              </Button>
              <Divider />
              <Button 
                block 
                danger
                onClick={() => {
                  localStorage.clear();
                  message.warning('All localStorage data cleared!');
                  refreshData();
                }}
              >
                Clear All localStorage
              </Button>
            </Space>
          </Card>
        </Col>

        {/* localStorage Debug */}
        <Col xs={24}>
          <Card title="💾 LocalStorage Debug" className="dev-card">
            <div className="localstorage-debug">
              <TextArea
                value={JSON.stringify(Object.keys(localStorage).reduce((obj, key) => {
                  obj[key] = localStorage.getItem(key);
                  return obj;
                }, {}), null, 2)}
                readOnly
                autoSize={{ minRows: 8, maxRows: 15 }}
                className="debug-textarea"
              />
              <div style={{ marginTop: 16 }}>
                <Button 
                  icon={<CopyOutlined />}
                  onClick={() => copyToClipboard(
                    JSON.stringify(Object.keys(localStorage).reduce((obj, key) => {
                      obj[key] = localStorage.getItem(key);
                      return obj;
                    }, {}), null, 2),
                    'LocalStorage Data'
                  )}
                >
                  Copy LocalStorage Data
                </Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DevPage; 