import React, { useEffect, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvent,
  Tooltip,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerForm from './MarkerForm';
import L from 'leaflet';
import NodeService from '../service/NodeService';
import DraggableCard from './DraggableCard';
import ConnectService from '../service/ConnectService';
import { toast, ToastContainer } from 'react-toastify';
import FiberDetailService from '../service/FiberDetailService';
import FiberService from '../service/FiberService';
import * as XLSX from 'xlsx';
const MyMap = () => {
  const center = [9.783, 105.467];
  const [markers, setMarkers] = useState([]);
  const [listFiber, setListFiber] = useState([]);
  const [connections, setConnections] = useState([]);
   const [connectionolds, setConnectionolds] = useState([]);
  const [DetailConnections, setDetailConnections] = useState([]);
  const [formState, setFormState] = useState({ visible: false, data: null });
  const [menu, setMenu] = useState(null);
  const [connectionPopup, setConnectionPopup] = useState(null);
  const [fiberPopup, setFiberPopup] = useState(null);
  const [selectedToIndex, setSelectedToIndex] = useState(null);
   const [ConnectLong, setConnectLong] = useState(null);
    const [Ngaynhap, setNgaynhap] = useState(null);
    const [note, setNote] = useState(null);
  const [connectionLabel, setConnectionLabel] = useState('');
  const [connectionType, setConnectionType] = useState('');
  const [zoom, setZoom] = useState(10);
  const [indexfiber, SetIndexFiber] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
   const [PortSelected, setPortSelected] = useState({});
  const [selectedPort, setSelectedPort] = useState(null);
const [showDisconnectButton, setShowDisconnectButton] = useState(false);
const [flag, setflag] = useState(false);
const [spliceForm, setSpliceForm] = useState(null);
const getRandomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);


// Hàm chuyển đổi số serial Excel thành Date JS
function excelDateToJSDate(serial) {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400; // giây
  const date_info = new Date(utc_value * 1000);

  return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate());
}

// Hàm format ngày: vừa nhận số, vừa nhận chuỗi
function formatExcelDate(value) {
  if (!value) return "";
  if (!isNaN(value)) {
    // Trường hợp là số serial Excel
    const date = excelDateToJSDate(Number(value));
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // DD/MM/YYYY
  }
  return value.toString().trim(); // Trường hợp đã là string
}

    const handleOpenModal = (e,marker) => {
      console.log(marker)
        e.originalEvent.preventDefault();
   
      setSelectedMarker({marker:marker, screenX:  e.originalEvent.clientX, screenY: e.originalEvent.clientY } );
    };

    const handleCloseModal = () => {
      setSelectedMarker(null);
    };
    const HandelSelectPort=(item,index)=>{
      console.log(item)
      findNameConectFiberById(item.id_fiber)
       setSelectedPort({
                        item:item,
                        portNumber: index ,
                      });
    }
  const toggleExpand = (index) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };
  const handleConnectionClick = (connection) => {
  FiberDetailService.getAll().then(
    res=>{
      let listFilter=res.data?Object.values(res.data).filter(e=>e.id_connect==connection.id):[]
      console.log(listFilter)
      const cableCount = parseInt(connection.cableType);
      const listcableCount = Array.from({ length: cableCount }, (_, i) => ({
        id: i + 1,
        port: i + 1,
        status:0
      }));
     
      listFilter.map((item,index)=>{
        let i=listcableCount.findIndex(e=>e.port==item.cableCount)
        console.log(listcableCount[i])
        listcableCount[i].status=1
        listcableCount[i].id_fiber=item.id_fiber
      })
      console.log(listcableCount)
      setDetailConnections(listcableCount)
    }
  )
  console.log('Đã click kết nối:', connection);

  setSelectedConnection(connection); // nếu muốn mở modal chi tiết
};

const findNameConectFiberById=(id)=>{
 FiberService.getAll().then(
  res=>{
    console.log(Object.values(res.data).filter(e=>e.id==id))
    setPortSelected(Object.values(res.data).filter(e=>e.id==id)[0])

  }
 )
}
  const getCustomIcon = (type, zoomLevel = 10) => {
    const baseSize = 30;
    const scale = Math.max(zoomLevel / 13, 0.5);
    const size = baseSize * scale;
    let iconUrl = 'https://cdn-icons-png.flaticon.com/512/684/684908.png';
    if (type === 'UPE') iconUrl = 'https://cdn-icons-png.flaticon.com/512/854/854878.png';
    else if (type === 'Small Cell') iconUrl = 'https://cdn-icons-png.flaticon.com/512/3103/3103446.png';
    else if (type === 'Cell Remote') iconUrl = 'https://cdn-icons-png.flaticon.com/512/850/850960.png';
    return new L.Icon({ iconUrl, iconSize: [size, size * 1.3], iconAnchor: [size / 2, size * 1.3], popupAnchor: [0, -size] });
  };

  const MapEvents = () => {
    const map = useMapEvent('zoomend', () => setZoom(map.getZoom()));
    useMapEvent('contextmenu', (e) => {
      setMenu({ type: 'add', latlng: e.latlng, screenX: e.originalEvent.clientX, screenY: e.originalEvent.clientY });
    });
    useMapEvent('click', () => {
      setMenu(null);
      setFormState({ visible: false, data: null });
      setConnectionPopup(null);
      setSelectedToIndex(null);
      setConnectionLabel('');
    });
    return null;
  };

  useEffect(() => {
    NodeService.getAll().then(res => setMarkers(res.data?Object.values(res.data):[]));
    ConnectService.getAll().then(res => 
      
      {
     
        const connectionsWithSplice = Object.values(res.data || {}).map(conn => ({
      ...conn,
      splicePoints: conn.splicePoints || [] // fallback nếu không có
    }));
    console.log(
      connectionsWithSplice
    )
      setConnections(res.data?connectionsWithSplice:[])
      setConnectionolds(res.data?connectionsWithSplice:[])
      }
      
 
    
    );
  }, [flag]);

  const handleMarkerRightClick = (e, markerId) => {
    e.originalEvent.preventDefault();
    console.log({ type: 'marker', markerId, screenX: e.originalEvent.clientX, screenY: e.originalEvent.clientY })
    setMenu({ type: 'marker', markerId, screenX: e.originalEvent.clientX, screenY: e.originalEvent.clientY });
  };

  const handleAdd = () => {
    setFormState({ visible: true, data: { name: '', type: '', latlng: menu.latlng } });
    setMenu(null);
  };

  const handleEdit = () => {
    const marker = markers.find(m => m.id === menu.markerId);
    const editingIndex = markers.findIndex(m => m.id === menu.markerId);
    console.log(marker,editingIndex)
    setFormState({ visible: true, data: { ...marker, editingIndex } });
    setMenu(null);
  };

  const handleDelete = () => {
    const updateds = markers.filter(m => m.id == menu.markerId);
    console.log(updateds[0])
    let listFilter= connections.filter(c => c.from == menu.markerId || c.to == menu.markerId)
    if (listFilter.length>0){
      toast.error("Không thể xóa trạm. Do tồn tại Tuyến cáp!!!")
    }
    else{
   NodeService.delete(updateds[0]).then(
      res=>{
        toast.success("Xóa Node thành công !!!")
      }
    )
    const updated = markers.filter(m => m.id !== menu.markerId);
    connections.filter(c => c.from == menu.markerId || c.to == menu.markerId).map((item,inex)=>{
                FiberService.getAll().then(
                  res=>{
                    Object.values(res.data).filter(e=>e.node_end==menu.markerId||e.node_start==menu.markerId).map((fiberdl,index)=>{
                      FiberService.delete(fiberdl)
                    })
                  }
                )

                FiberDetailService.getAll().then(
                  res=>{
                    Object.values(res.data).filter(e=>e.id_connect==item.id).map((fiberdl,index)=>{
                      FiberDetailService.delete(fiberdl)
                    })
                  }
                )
                ConnectService.delete(item).then(res=>{
                  

                })
                
              
    }
      
    )

    setMarkers(updated);
    setConnections(connections.filter(c => c.from !== menu.markerId && c.to !== menu.markerId));
    setMenu(null);
    }
 

  };

  const handleStartConnect = () => {
    setConnectionPopup({ fromId: menu.markerId, screenX: menu.screenX, screenY: menu.screenY });
    setMenu(null);
  };

  const handleStartFiber = () => {
    const list = [];
    SetIndexFiber(0);
    const newItem = {
      id: randomId("fiberdetail_"),
      current: menu.markerId,
      neighbor: "",
      selectConnect: "",
      listConect: connections.filter(e => e.to === menu.markerId || e.from === menu.markerId),
      listcableCount:[],
      cableCount:""
    };
    list.push(newItem);
    setListFiber(list);
    setFiberPopup({ fromId: menu.markerId, screenX: menu.screenX, screenY: menu.screenY });
    setMenu(null);
  };

  const handleConfirmConnection = () => {
    if (selectedToIndex === null || selectedToIndex === connectionPopup.fromId || !ConnectLong ||!connectionLabel) {
      toast.error("Vui lòng nhập đủ thông tin")
      return
    };
    const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    const offsetIndex = connections.filter(c => (c.from === connectionPopup.fromId && c.to === selectedToIndex) || (c.from === selectedToIndex && c.to === connectionPopup.fromId)).length;
    const newConect = { id: randomId("conect_"), from: connectionPopup.fromId, to: selectedToIndex, label: connectionLabel, color, offsetIndex, cableType: connectionType ,km:ConnectLong,ngaynhap:Ngaynhap,ghichu:note};
    ConnectService.update(newConect).then(() => toast.success("Thêm kết nối thành công"));
    setConnections((prev) => [...prev, newConect]);
    setConnectionPopup(null);
    setSelectedToIndex(null);
    setConnectionLabel('');
    setConnectLong("")
    setNote("")
    setNgaynhap("")
    setConnectionType('');
  };
  const handleConfirmFiber=()=>{
      const isValid = listFiber.every(item =>
        item.portStart && item.portEnd && item.cableCount && item.selectConnect
      );

      if (!isValid) {
        toast.info("Vui lòng nhập đầy đủ thông tin !!!");
        return;
      }
      console.log(listFiber)
      const listFiberNew=[]
      const id_fiber=randomId("fiber_")
      listFiber.map((item,index)=>{
        let newItem={id:item.id,id_fiber:id_fiber, cableCount:item.cableCount,portEnd:item.portEnd,portStart:item.portStart,id_connect:item.selectConnect}
        FiberDetailService.update(newItem).then(res=>{
          console.log(res.data)
        })
      })
      let node_end=listFiber[listFiber.length-1].neighbor
      if (listFiber.length<2){
                node_end=listFiber[0].neighbor
      }
      let fibernew={id:id_fiber,node_start:listFiber[0].current,node_end:node_end,name:markers.find(m => m.id === listFiber[0].current)?.name+"-"+
                                                                                       markers.find(m => m.id === node_end)?.name}
      FiberService.update(fibernew).then(
        res=>{
          console.log(res.data)
          toast.success("Thêm đường quang thành công")
        }
      )
  }
  const changeSelectConect=(e,i)=>{
    let list=listFiber
    list[i].selectConnect=e
    let index=connections.findIndex(item=>item.id==e)
    console.log(connections[index],parseInt(connections[index].cableType))
    const cableCount = parseInt(connections[index].cableType);
    const listcableCount = Array.from({ length: cableCount }, (_, i) => ({
      id: i + 1,
      value: i + 1,
    }));
    console.log(listcableCount)
    list[i].listcableCount=listcableCount
    if (connections[index].to==list[i].current)
        list[i].neighbor=connections[index].from
    else
      list[i].neighbor=connections[index].to
    
  setListFiber([...list])
    console.log(list)
  }
   const changeSelectCableCount=(e,i)=>{
    let list=listFiber
    list[i].cableCount=e
    list[i].portEnd=e
    list[i].portStart=e
   
    
  setListFiber([...list])
    console.log(list)
  }
  const changePortStart=(e,i)=>{
   let list=listFiber
    list[i].portStart=e    
  setListFiber([...list])
    console.log(list)
  }
    const changePortEnd=(e,i)=>{
   let list=listFiber
    list[i].portEnd=e    
  setListFiber([...list])
    console.log(list)
  }
  const handleCreateConectFiber=()=>{
     let list=listFiber
     let newCurrent=listFiber[indexfiber].neighbor
      let LastNeighbor=listFiber[indexfiber].current
      let newItem={
      id:randomId("fiberdetail_"),
      current:newCurrent,
      neighbor:"",
      selectConnect:"",
      listConect: connections.filter(e=>(e.to==newCurrent||e.from==newCurrent) && (e.to!=LastNeighbor&&e.from!=LastNeighbor)),
      listcableCount:[],
      cableCount:""
    }
    console.log(newItem.listConect,LastNeighbor)
    list.push(newItem)
    SetIndexFiber(indexfiber+1)
     setListFiber([...list])
  }
  const handleBackConectFiber=()=>{
    let list=listFiber
    list=list.filter(e=>e.id!=list[list.length-1].id)
    console.log(list,listFiber)
    SetIndexFiber(indexfiber-1)
    setListFiber([...list])

  }
  const randomId = (prefix = '') => prefix + Math.random().toString(36).substr(2, 11);

  const handleSubmitForm = (newData) => {
    if (newData.editingIndex != null) {
      const updated = [...markers];
      updated[newData.editingIndex] = newData;
      console.log(updated[0])
      NodeService.update(updated[0]).then(
        res=>{
          toast.success("Cập nhật thông tin thành công")
        }
      );
      setMarkers(updated);
    } 
    
    
    else {
        const id = randomId('node_');
        newData.id = id;

        // Kiểm tra trùng latlng
        let isDuplicate = -1
        let list=[...markers]
        console.log(
          markers.filter(
          (m) => m.latlng.lat == newData.latlng.lat && m.latlng.lng == newData.latlng.lng && m.name==newData.name
          )
        )
        isDuplicate= markers.filter(
          (m) => m.latlng.lat == newData.latlng.lat && m.latlng.lng == newData.latlng.lng && m.name==newData.name
          )
        // console.log(markers,isDuplicate,newData)

        if (isDuplicate.length>0) {
          toast.error("⚠️  trạm "+newData.name+" đã tồn tại tại vị trí này!");
          return;
        }
        // console.log(markers.length)
        // newData.name=(markers.length+1)+". "+newData.name
        NodeService.update(newData).then((res) => {
          toast.success("✅ Thêm trạm "+newData.name+" thành công");
        });

        setMarkers((prev) => [...prev, newData]);
      }

    setFormState({ visible: false, data: null });
  };

const getArcCoordinates = (from, to, offsetIndex = 0) => {
  const offsetMultiplier = 0.0048;
  const latlng1 = L.latLng(from);
  const latlng2 = L.latLng(to);
  const midpoint = [(latlng1.lat + latlng2.lat) / 2, (latlng1.lng + latlng2.lng) / 2];
  const dx = latlng2.lng - latlng1.lng;
  const dy = latlng2.lat - latlng1.lat;
  const norm = Math.sqrt(dx * dx + dy * dy);
  const offsetX = -dy / norm * offsetIndex * offsetMultiplier;
  const offsetY = dx / norm * offsetIndex * offsetMultiplier;
  const controlPoint = [midpoint[0] + offsetY, midpoint[1] + offsetX];
  return [from, controlPoint, to];
};

  const DeleteConnect =()=>{
    console.log(DetailConnections,selectedPort)
  let listcableCount=DetailConnections
   FiberDetailService.getAll().then(res=>{
     Object.values(res.data).filter(e=>e.id_fiber==PortSelected.id).map((item,index)=>{
      FiberDetailService.delete(item)
      console.log(item)

     })
     toast.success("Xóa kết nối thành công")
     let i=listcableCount.findIndex(e=>e.id==selectedPort.portNumber)
    // listcableCount[i].id_fiber=""
    listcableCount[i].status=0
    setDetailConnections([...listcableCount])
    
   })

    FiberService.getAll().then(res=>{
     Object.values(res.data).filter(e=>e.id==PortSelected.id).map((item,index)=>{
      FiberService.delete(item)
      console.log(item)

     })

   })
   setSelectedPort(null)

  }
  const viewDetailConect=()=>{
     setShowDisconnectButton(true);
    console.log(PortSelected)
    FiberService.getAll().then(res=>{
      console.log(res.data)
    })
    FiberDetailService.getAll().then(res=>{
       ConnectService.getAll().then(
        ress=>{
          let list=[]
          let list_node=[]
          Object.values(res.data).filter(e=>e.id_fiber==PortSelected.id).map((item,index)=>{
            let connect=Object.values(ress.data).filter(e=>e.id==item.id_connect)[0]
            console.log(item)
            list.push(connect)
            setConnections([...list])
            
         

          })
          NodeService.getAll().then(
                      ress=>{
                        console.log(list)
                        list.map((items,index)=>{
                        let node=Object.values(ress.data).filter(e=>e.id==items.from)[0]
                        let node_to=Object.values(ress.data).filter(e=>e.id==items.to)[0]
                        if (list_node.findIndex(e=>e.id==node.id)<0){
                          list_node.push(node)
                        }
                          if (list_node.findIndex(e=>e.id==node_to.id)<0){
                          list_node.push(node_to)
                        }
                      console.log(list_node)
                      setMarkers([...list_node])
                        })
                        
                      }
                    )
        
      }
    )
     
    })
   
    
    setSelectedPort(null)
    setSelectedConnection(null)
  }
  const handleDisconnect=()=>{
    //   ConnectService.getAll().then(
    //     res=>{
        

    //        setConnections( Object.values(res.data))
        

        
    //   }
    // )
    setflag(!flag)
      setShowDisconnectButton(false);
  }
  const handleRightClick = (conn, event) => {
  console.log('Right click on connection:', conn);
  // Ví dụ: mở menu chuột phải, xoá, chỉnh sửa...
};

const DeleteTuyenCap=()=>{
  console.log(selectedConnection)
  FiberDetailService.getAll().then(
    res=>{
      if (res.data){
  let listFilter =Object.values(res.data).filter(e=>e.id_connect==selectedConnection.id)
      console.log(listFilter)
      if (listFilter.length>0){
        toast.error("Không thể xóa Tuyến cáp. Do tồn tại kết nối quang!!!")
      }
      else{
       ConnectService.delete(selectedConnection).then(
        res=>{
          toast.success("Xóa Cáp quang thành công !!")
          setConnections(connections.filter(e=>e.id!=selectedConnection.id))
          setSelectedConnection(null)
         
        }
       )
      }
      }
    else{
       ConnectService.delete(selectedConnection).then(
        res=>{
          toast.success("Xóa Cáp quang thành công !!")
          setConnections(connections.filter(e=>e.id!=selectedConnection.id))
          setSelectedConnection(null)
         
        }
       )
      }
    }
  )
}
const handleSaveSplicePoint = () => {
  const updatedConnections = connections.map(conn => {
    if (conn.id === spliceForm.connectionId) {
      const newSplice = {
        id: randomId("splice_"),
        name: spliceForm.name || `Mối hàn ${conn.splicePoints?.length + 1 || 1}`,
        latlng: [spliceForm.lat, spliceForm.lng],
        order: (conn.splicePoints?.length || 0) + 1,
        km:spliceForm.km,
        nodename:spliceForm.nodename
      };

      const updatedConn = {
        ...conn,
        splicePoints: [...(conn.splicePoints || []), newSplice]
      };

      ConnectService.update(updatedConn); // nếu có backend
      return updatedConn;
    }
    return conn;
  });

  setConnections(updatedConnections);
  setSpliceForm(null);
  toast.success(" Đã thêm mối hàn");
};



const handleImportExcel = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (evt) => {
    const data = new Uint8Array(evt.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    const newConnections = [];
    let connect=[...connections]
    rows.forEach((row, index) => {
       const id = row.id?.toString().trim();
      const fromName = row.from_node?.toString().trim();
      const toName = row.to_node?.toString().trim();
      const label = row.label?.toString().trim() || `Tuyến ${index + 1}`;
      const cableType = row.cableType?.toString().trim() || "24FO";
      const km = row.km?.toString().trim() 
       const ngaynhap = formatExcelDate(row.ngaynhap); 
      const ghichu = row.ghichu?.toString().trim() 

      const fromNode = markers.find(m => m.name?.trim() === fromName);
      const toNode = markers.find(m => m.name?.trim() === toName);

      if (!fromNode || !toNode) {
        toast.warning(`⚠️ Không tìm thấy node "${fromName}" hoặc "${toName}" ở dòng ${index + 2}`);
        return;
      }
      let checks=connections.filter(e=>e.id)
      if (checks.length>0){
        toast.error("ID "+id+" đã tồn tại")
      }
     else{
       const conn = {
        id: id,
        from: fromNode.id,
        to: toNode.id,
        label,
        cableType,
          offsetIndex:
        connect.filter(
          (c) =>
            (c.from === fromNode.id && c.to === toNode.id) ||
            (c.from === toNode.id && c.to === fromNode.id)
        ).length,
        km:km,
        ngaynhap:ngaynhap,
        ghichu:ghichu,

        color: getRandomColor(),
        splicePoints: []
      };
      connect.push(conn)
      newConnections.push(conn);
     }
    });

    // Gửi lên server & cập nhật UI
    newConnections.forEach(conn => {
      ConnectService.update(conn);
    });

    setConnections(prev => [...prev, ...newConnections]);
    toast.success(`📡 Đã import ${newConnections.length} kết nối từ Excel thành công!`);
  };

  reader.onerror = () => {
    toast.error("❌ Lỗi khi đọc file Excel.");
  };
  setConnectionPopup(null)
  reader.readAsArrayBuffer(file);
};


  return (
    <div>
    {menu && (
        <div
          style={{
            position: 'absolute',
            top: menu.screenY,
            left: menu.screenX,
            background: 'white',
            border: '1px solid #ccc',
            padding: '6px',
            zIndex: 1000,
          }}
        >
          {menu.type === 'add' && <button onClick={handleAdd}>➕ Thêm Trạm</button>}
          {menu.type === 'marker' && (
            <>
              <button onClick={handleEdit}>✏️ Sửa</button>
              <button onClick={handleDelete}>🗑️ Xoá</button>
              <button onClick={handleStartConnect}>🔗Thêm tuyến quang </button>
              <button
                  
                    onClick={handleStartFiber}
                   
                  >
                    ➕ Thêm kết nối
                  </button>
            </>
          )}
        </div>
      )}

      {formState.visible && (
        <MarkerForm
          initialData={formState.data}
          markers={markers}
          onCancel={() => setFormState({ visible: false, data: null })}
          onSubmit={handleSubmitForm}
        />
      )}
      {connectionPopup && (
        <DraggableCard
          top={connectionPopup.screenY}
          left={connectionPopup.screenX}
          title={`🔗 Kết nối từ: ${markers.find(m => m.id === connectionPopup.fromId)?.name || 'Marker'}`}
          onClose={() => setConnectionPopup(null)}
          width={500}
        >
          <div className="mb-2">
            <label className="form-label">Tên kết nối</label>
            <input
              type="text"
              className="form-control"
              value={connectionLabel}
              onChange={(e) => setConnectionLabel(e.target.value)}
              placeholder="Nhập tên"
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Loại tuyến cáp</label>
            <select
              className="form-select"
              value={connectionType}
              onChange={(e) => setConnectionType(e.target.value)}
            >
              <option value="">-- Chọn loại --</option>
              <option value="12FO">12FO</option>
               <option value="16FO">16FO</option>
              <option value="24FO">24FO</option>
              <option value="48FO">48FO</option>
              <option value="96FO">96FO</option>
             
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Chọn điểm đến</label>
            <select
              className="form-select"
              value={selectedToIndex ?? ''}
              onChange={(e) => setSelectedToIndex(e.target.value)}
            >
              <option value="" disabled>-- Chọn marker --</option>
              {markers
  .slice()
  .sort((a, b) => {
    // Hàm lấy số thứ tự ở đầu chuỗi, ví dụ: "10. Trạm..." -> 10
    const getNumber = (str) => {
  const match = str.trim().match(/^(\d+)\./); 
  return match ? parseInt(match[1], 10) : Infinity;
};


    return getNumber(a.name) - getNumber(b.name);
  }).map((m) =>
                m.id !== connectionPopup.fromId && (
                  <option key={m.id} value={m.id}>
                    {m.name || 'Marker'}
                  </option>
                )
              )}
            </select>
          </div>
          {selectedToIndex&&(
     <div className="mb-2">
        <label className="form-label">Khoảng cách đến {markers.find(m => m.id === selectedToIndex)?.name || 'Marker'}</label>
        <input
          type="number"
          className="form-control"
          value={ConnectLong}
         onChange={(e) => setConnectLong(e.target.value)}
        />
      </div>
          )}
           <div className="mb-2">
        <label className="form-label">Ngày nhập trạm</label>
        <input
          type="date"
          className="form-control"
          value={Ngaynhap}
         onChange={(e) => setNgaynhap(e.target.value)}
        />
      </div>
            <div className="mb-2">
        <label className="form-label">Ghi chú</label>
        <input
          type="text"
          className="form-control"
          value={note}
         onChange={(e) => setNote(e.target.value)}
        />
      </div>
      

          <div className="d-flex justify-content-end gap-2">
                                   <input
                          type="file"
                          accept=".xlsx, .xls"
                          style={{ display: 'none' }}
                          id="excelInput"
                          onChange={handleImportExcel}
                        />
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => document.getElementById('excelInput').click()}
                        >
                          📥Import từ excel
                        </button>
                


            <button className="btn btn-outline-secondary btn-sm" onClick={() => setConnectionPopup(null)}>
              ❌ Huỷ
            </button>
            <button className="btn btn-success btn-sm" onClick={handleConfirmConnection}>
              ✅ Tạo
            </button>
          </div>
        </DraggableCard>
      )}

       {fiberPopup && (
        <DraggableCard
          top={fiberPopup.screenY}
          left={fiberPopup.screenX}
          title={`🔗 Kết nối từ: ${markers.find(m => m.id === fiberPopup.fromId)?.name || 'Marker'}`}
          onClose={() => setFiberPopup(null)}
          width={900}
        >
       {listFiber && listFiber.map((item, index) => (
        <div key={index} className="border p-3 mb-3 rounded shadow-sm">
          {/* Nút thu gọn/mở rộng */}
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Sợi quang #{index + 1}</h5>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => toggleExpand(index)}
            >
              {expandedIndex === index ? 'Thu gọn ▲' : 'Chi tiết ▼'}
            </button>
          </div>

          {/* Nội dung chi tiết chỉ hiện khi expanded */}
          {expandedIndex === index && (
            <>
              <div className="mb-2 mt-3">
                <label className="form-label">Trạm Bắt đầu</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly
                  value={markers.find(m => m.id === item.current)?.name || 'Marker'}
                  placeholder="Nhập tên"
                />
              </div>

              <div className="row">
                <div className="col col-lg-4">
                  <div className="mb-2">
                    <label className="form-label">Điểm bắt đầu</label>
                    <input
                      type="text"
                      className="form-control"
                      value={item.portStart}
                      onChange={(e) => changePortStart(e.target.value, index)}
                      placeholder="Nhập điểm bắt đầu"
                    />
                  </div>
                </div>
                <div className="col col-lg-8">
                  <div className="mb-2">
                    <label className="form-label">Chọn đường kết nối</label>
                    <select
                      className="form-select"
                      value={item.selectConnect}
                      onChange={(e) => changeSelectConect(e.target.value, index)}
                    >
                      <option value="" disabled>-- Chọn kết nối --</option>
                      {item.listConect.map((m, i) => (
                        <option key={i} value={m.id}>
                          {m.label || 'Marker ' + i}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col col-lg-4">
                  <div className="mb-2">
                    <label className="form-label">Trạm kết thúc</label>
                    <input
                      type="text"
                      className="form-control"
                      readOnly
                      value={markers.find(m => m.id === item.neighbor)?.name || ''}
                      // placeholder="Nhập Trạm kết thúc"
                    />
                  </div>
                </div>
                <div className="col col-lg-4">
                  <div className="mb-2">
                    <label className="form-label">Chọn Sợi Quang</label>
                    <select
                      className="form-select"
                      value={item.cableCount}
                      onChange={(e) => changeSelectCableCount(e.target.value, index)}
                    >
                      <option value="" disabled>-- Chọn sợi quang --</option>
                      {item.listcableCount.map((m, i) => (
                        <option key={i} value={m.id}>
                          {m.value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="col col-lg-4">
                  <div className="mb-2">
                    <label className="form-label">Điểm kết thúc</label>
                    <input
                      type="text"
                      className="form-control"
                      value={item.portEnd}
                      onChange={(e) => changePortEnd(e.target.value, index)}
                      placeholder="Nhập Điểm kết thúc"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
       
         

         
         <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setFiberPopup(null)}
          >
            ❌ Huỷ
          </button>
           <button
            className="btn btn-warning btn-sm"
            onClick={handleBackConectFiber}
          >
             Trở lại
          </button>
           <button
            className="btn btn-primary btn-sm"
            onClick={ handleCreateConectFiber}
          >
             Thêm kết nối
          </button>
          <button
            className="btn btn-success btn-sm"
            onClick={handleConfirmFiber}
          >
            ✅ Lưu
          </button>
        </div>
        </DraggableCard>
      )}

        {selectedMarker && (
           <DraggableCard
          top={selectedMarker.screenY}
          left={selectedMarker.screenX}
          title={`Chi tiết Marker: ${selectedMarker.marker.name}`}
          onClose={handleCloseModal}
          width={900}
        >
     
            <div className="p-3">
          <p><strong>Loại:</strong> {selectedMarker.marker.type}</p>
          <p><strong>Tọa độ:</strong> {selectedMarker.marker.latlng.lat}, {selectedMarker.marker.latlng.lng}</p>

          {/* Nếu muốn thêm thông tin khác */}
          {/* <p><strong>ID:</strong> {selectedMarker.id}</p> */}
          {/* <p><strong>Ghi chú:</strong> {selectedMarker.note}</p> */}
        </div>
            

         
         <div className="d-flex justify-content-end gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setFiberPopup(null)}
          >
            ❌ Huỷ
          </button>
           <button
            className="btn btn-warning btn-sm"
            onClick={handleBackConectFiber}
          >
             Trở lại
          </button>
           <button
            className="btn btn-primary btn-sm"
            onClick={ handleCreateConectFiber}
          >
             Thêm kết nối
          </button>
          <button
            className="btn btn-success btn-sm"
            onClick={handleConfirmFiber}
          >
            ✅ Lưu
          </button>
        </div>
        </DraggableCard>
          )}
          {selectedConnection && (
        <DraggableCard
          title={`${selectedConnection.label || 'Không tên'}`}
          onClose={() => setSelectedConnection(null)}
          width={700}
        >
          <div className="p-2">
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle text-center shadow-sm rounded">
              <thead className="table-primary">
                <tr>
                  <th colSpan="5" className="fs-5 text-uppercase">Thông tin kết nối</th>
                </tr>
                <tr className="table-light">
                  <th>Từ</th>
                  <th>Đến</th>
                  <th>Loại cáp</th>
                   <th>Độ dài cáp</th>
                  <th>Ngày hòa mạng</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{markers.find(m => m.id === selectedConnection.from)?.name }</td>
                  <td>{markers.find(m => m.id === selectedConnection.to)?.name }</td>
                  <td>{selectedConnection.cableType +"FO"|| 'Không xác định'}</td>
                   <td>{selectedConnection.km +"Km"|| 'Không xác định'}</td>
                  <td>{selectedConnection.ngaynhap}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
              <div className=" text-end">
            <button
              className="btn btn-danger"
              onClick={() => DeleteTuyenCap()
              }
            >
              🗑️ Xóa kết nối
            </button>
          </div>
        <div className="p-1">
  <div className="mb-2 fw-bold">Trạng thái Port:</div>
  <div className="d-flex flex-wrap gap-2">
    {
      DetailConnections.map((item,index)=>{
        return(
          <div
                key={index}
                className="border rounded text-center d-flex align-items-center justify-content-center"
                style={{
                  cursor:"pointer",
                  width: '50px',
                  height: '50px',
                  backgroundColor: item.status === 1 ? '#28a745' : '#dee2e6',
                  color: item.status === 1 ? 'white' : 'black',
                  fontWeight: '500',
                  fontSize: '16px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
                onClick={() => {
                    if (item.status === 1) {
                      HandelSelectPort(item,index+1)
                     
                    }
                  }}
                              >
                                {index + 1}
              </div>
                )
              })
            }
          
          </div>
        </div>

    

        </DraggableCard>
      )}
          {selectedPort && (
            <DraggableCard
              title={`Thông tin Port #${selectedPort.portNumber}`}
              onClose={() => setSelectedPort(null)}
              width={500}
            >
                          <div className="p-3">
              <table className="table table-bordered table-sm mb-3">
                <tbody>
                  <tr>
                    <th style={{ width: '35%' }}>🔌 Port số</th>
                    <td>{selectedPort.portNumber}</td>
                  </tr>
                  <tr>
                    <th>⚙️ Trạng thái</th>
                    <td className="text-success fw-bold">Đang sử dụng</td>
                  </tr>
                  <tr>
                    <th>🔗 Tên kết nối</th>
                    <td>{PortSelected.name || 'Không có'}</td>
                  </tr>
                </tbody>
              </table>
           
            <div className="text-end">
                 <button className="btn btn-danger btn-sm me-2" onClick={DeleteConnect}>
                🗑️ Xóa
              </button>
              <button className="btn btn-primary btn-sm " onClick={viewDetailConect}>
                🔍 Xem chi tiết
              </button>
           
            </div>

            </div>

            </DraggableCard>
          )}
{showDisconnectButton && (
  <button
    className="btn btn-danger btn-sm position-fixed"
    style={{ top: '20px', right: '20px', zIndex: 1050 }}
    onClick={handleDisconnect}
  >
    🔌 Đóng 
  </button>
)}
      <MapContainer center={center} zoom={12} className="leaflet-container">
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents />
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={m.latlng}
            icon={getCustomIcon(m.type, zoom)}
            eventHandlers={{  click: (e) => handleOpenModal(e,m),
            contextmenu: (e) => handleMarkerRightClick(e, m.id) }}
            
          >
             <Tooltip direction="bottom" offset={[0, -10]} permanent interactive={false}>


                                    <div style={{ textAlign: 'center' ,fontWeight: 'bold', fontSize: '10px' }}>
                        {m.name || 'Trạm'}
                        {m.ghichu && (
                          <>
                            <br />
                            ({m.ghichu})
                          </>
                        )}
                      </div>
           
            </Tooltip>
            {/* <Popup>
              <b>{m.name}</b><br />
              Loại: {m.type}
            </Popup> */}
          </Marker>
        ))}
      
{spliceForm && (
  <DraggableCard
    title="➕ Thêm Măng xoong"
    onClose={() => setSpliceForm(null)}
    width={300}
  >
    <div onClick={(e) => e.stopPropagation()}>
      <div className="mb-2">
        <label className="form-label">Tên măng xoong</label>
        <input
          type="text"
          className="form-control"
          value={spliceForm.name}
          onChange={(e) =>
            setSpliceForm({ ...spliceForm, name: e.target.value })
          }
        />
      </div>

       <div className="mb-2">
        <label className="form-label">Khoảng cách đến {spliceForm.nodename}</label>
        <input
          type="number"
          className="form-control"
          value={spliceForm.km}
          onChange={(e) =>
            setSpliceForm({ ...spliceForm, km: e.target.value })
          }
        />
      </div>
      <div className="row mb-2">
        <div className="col">
          <label className="form-label">Lat</label>
          <input
            type="number"
            className="form-control"
            value={spliceForm.lat}
            onChange={(e) =>
              setSpliceForm({ ...spliceForm, lat: parseFloat(e.target.value) })
            }
          />
        </div>
        <div className="col">
          <label className="form-label">Lng</label>
          <input
            type="number"
            className="form-control"
            value={spliceForm.lng}
            onChange={(e) =>
              setSpliceForm({ ...spliceForm, lng: parseFloat(e.target.value) })
            }
          />
        </div>
      </div>
      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-sm btn-secondary" onClick={() => setSpliceForm(null)}>
          ❌ Hủy
        </button>
        <button className="btn btn-sm btn-success" onClick={handleSaveSplicePoint}>
          💾 Lưu
        </button>
      </div>
    </div>
  </DraggableCard>
)}



{connections.map((conn) => {
  const from = markers.find(m => m.id === conn.from)?.latlng;
  const to = markers.find(m => m.id === conn.to)?.latlng;
  if (!from || !to) return null;

  const splicePoints = (conn.splicePoints || [])
    .sort((a, b) => a.order - b.order)
    .map(sp => sp.latlng);

  const allPoints = [from, ...splicePoints, to];

  return allPoints.slice(0, -1).map((start, index) => {
    const end = allPoints[index + 1];

    const offsetIndex = conn.offsetIndex ?? 0;
    const arc = getArcCoordinates(start, end, offsetIndex);

    return (
      <Polyline
        key={`${conn.id}_segment_${index}`}
        positions={arc}
        color={conn.color || 'blue'}
        weight={5}
        opacity={0.9}
        eventHandlers={{
          click: () => handleConnectionClick(conn),
          contextmenu: (e) => {
            e.originalEvent.preventDefault();
            
            console.log(markers.filter(e=>e.id==conn.from)[0].name,conn.from)
            setSpliceForm({
              connectionId: conn.id,
              lat: e.latlng.lat,
              lng: e.latlng.lng,
              screenX: e.originalEvent.clientX,
              screenY: e.originalEvent.clientY,
              name: '',
              nodename:markers.filter(e=>e.id==conn.from)[0].name,
              km:''
            });
          }
        }}
      >
        {index === 0 && (
          <Tooltip direction="top" sticky>
         <div style={{ textAlign: 'center' }}>
    {conn.label || 'Tuyến cáp'}
    {conn.ghichu && (
      <>
        <br />
        ({conn.ghichu})
      </>
    )}
  </div>
          </Tooltip>
        )}
      </Polyline>
    );
  });
})}


{connections.flatMap(conn =>
  (conn.splicePoints || []).map((sp, index) => (
  
   <>
   {/* {console.log(sp)} */}
    <Marker
      key={sp.id}
      position={sp.latlng}
      icon={L.divIcon({
        className: 'splice-icon',
        html: `<div style="background:#f00;width:10px;height:10px;border-radius:50%"></div>`,
      })}
    >
      <Tooltip direction="top">{`${sp.name} ${sp.km}Km đến ${sp.nodename}`}</Tooltip>
    </Marker>
   </>
  ))
)}

      </MapContainer>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default MyMap;
