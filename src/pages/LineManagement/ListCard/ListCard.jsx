import { Card, Space,Typography, Tooltip, Button, Badge, Input, List } from "antd";
import { SaveFilled, PlusOutlined, SearchOutlined, DragOutlined, EllipsisOutlined } from "@ant-design/icons";
import { Droppable, Draggable } from "react-beautiful-dnd";
import "./ListCard.css";
const { Text } = Typography;

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
    onSave,
    showAddButton = true
}) => {
    const handleWheel = (e) => {
        const container = e.currentTarget;
        const isScrollingUp = e.deltaY < 0;
        const isScrollingDown = e.deltaY > 0;
    
        if (
            (isScrollingUp && container.scrollTop === 0) ||
            (isScrollingDown && container.scrollTop + container.clientHeight >= container.scrollHeight)
        ) {
            // Allow parent to scroll
        } else {
            e.stopPropagation();
        }
    };
    
    return (
    <Card
        className="line-management-card"
        title={
            <div className="line-management-card-title d-flex">
                <div className="d-flex align-items-center flex-1">
                    <div className="d-flex align-items-center gap-2 ">
                        {icon}
                        <Text style={{marginLeft: '10px'}} strong className=" mr-2 card-title-text">{title}</Text>
                    </div>
                    <Badge 
                        count={data.length} 
                        style={{ backgroundColor: 'var(--primary-color)' }} 
                        className="card-title-badge"
                    />
                </div>
                <div className="d-flex align-items-center gap-1 flex-shrink-0">
                    {showSortButtons && (
                        <Tooltip title="Lưu thay đổi">
                            <button
                                onClick={onSave}
                                className="line-management-card-save-btn"
                            >
                                <SaveFilled />
                            </button>
                        </Tooltip>
                    )}
                    {showAddButton && (
                        <Tooltip title="Thêm mới">
                            <Button onClick={onAdd} type="text" icon={<PlusOutlined />} />
                        </Tooltip>
                    )}
                </div>
            </div>
        }
    >
        <Input
            placeholder={`Tìm kiếm ${title.toLowerCase()}...`}
            prefix={<SearchOutlined />}
            className="line-management-input-search"
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
        />
        {droppableId === 'segments' ? (
            <List
                onWheel={handleWheel}
                className="line-management-list"
                dataSource={data}
                
                renderItem={(item) => (
                    <List.Item
                        className="line-management-list-item"
                        actions={[
                            <EllipsisOutlined
                                style={{ cursor: "pointer" }}
                                onClick={() => onMenuClick?.('EDIT', item)}
                            />
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
                    
                        onWheel={handleWheel}
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
                                                <EllipsisOutlined
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => onMenuClick?.('EDIT', item)}
                                                />
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
};