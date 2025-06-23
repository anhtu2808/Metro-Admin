import { Card, Space,Typography, Tooltip, Button, Badge, Input, List, Dropdown } from "antd";
import { SaveFilled, PlusOutlined, SearchOutlined, DragOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Droppable, Draggable } from "react-beautiful-dnd";
import "./ListCard.css";
const { Text } = Typography;
const menuItems = [
    { key: "EDIT", label: "Edit" },
    { key: "DELETE", label: "Delete" },
];

export const ListCard = ({
    title,
    data,
    onAdd,
    onMenuClick,
    onItemClick,
    selectedItem,
    icon,
    droppableId,
    searchValue,
    onSearch,
    showSortButtons = false,
    onSave
}) => (
    <Card
        className="line-management-card"
        title={
            <div className="line-management-card-title">
                <Space>
                    {icon}
                    <Text strong>{title}</Text>
                    <Badge count={data.length} style={{ backgroundColor: '#1890ff' }} />
                </Space>
                <Space>
                    {showSortButtons && (
                        <>
                            <Tooltip title="Save changes">
                                <button
                                    onClick={onSave}
                                    className="line-management-card-save-btn"
                                >
                                    <SaveFilled />
                                </button>
                            </Tooltip>
                        </>
                    )}
                    <Tooltip title="Add new">
                        <Button onClick={onAdd} type="text" icon={<PlusOutlined />} />
                    </Tooltip>
                </Space>
            </div>
        }
    >
        <Input
            placeholder={`Search ${title.toLowerCase()}...`}
            prefix={<SearchOutlined />}
            className="line-management-input-search"
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
        />
        {droppableId === 'segments' ? (
            <List
                className="line-management-list"
                dataSource={data}
                renderItem={(item) => (
                    <List.Item
                        className="line-management-list-item"
                        actions={[
                            <Dropdown
                                menu={{
                                    items: menuItems,
                                    onClick: ({ key }) => onMenuClick?.(key, item),
                                }}
                                trigger={['click']}
                            >
                                <EllipsisOutlined style={{ cursor: "pointer" }} />
                            </Dropdown>
                        ]}
                    >
                        <div className="line-management-list-item-content">
                            <Text>{item}</Text>
                        </div>
                    </List.Item>
                )}
            />
        ) : (
            <Droppable droppableId={droppableId}>
                {(provided) => (
                    <List
                        className="line-management-list"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        dataSource={data}
                        renderItem={(item, index) => {
                            const isSelected = selectedItem && (
                                (typeof item === 'object' && item.id === selectedItem.id) ||
                                (typeof item === 'string' && item === selectedItem)
                            );
                            
                            return (
                                <Draggable
                                    key={typeof item === 'object' ? item.id : item}
                                    draggableId={`${droppableId}-${typeof item === 'object' ? item.id : item}`}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <List.Item
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`line-management-list-item ${snapshot.isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''}`}
                                            onClick={() => onItemClick && onItemClick(item)}
                                            actions={[
                                                <div {...provided.dragHandleProps} className="line-management-drag-handle">
                                                    <DragOutlined style={{ cursor: 'grab', marginRight: 8 }} />
                                                </div>,
                                                <Dropdown
                                                    menu={{
                                                        items: menuItems,
                                                        onClick: ({ key }) => onMenuClick?.(key, item),
                                                    }}
                                                    trigger={['click']}
                                                >
                                                    <EllipsisOutlined style={{ cursor: "pointer" }} />
                                                </Dropdown>
                                            ]}
                                        >
                                            <div className="line-management-list-item-content">
                                                <Text>{typeof item === 'object' ? item.name : item}</Text>
                                            </div>
                                        </List.Item>
                                    )}
                                </Draggable>
                            );
                        }}
                    >
                        {provided.placeholder}
                    </List>
                )}
            </Droppable>
        )}
    </Card>
);