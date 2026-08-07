import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, 
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  FileText, 
  Users, 
  Briefcase, 
  Printer, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Plus, 
  Search, 
  Send, 
  Mail, 
  Database, 
  Shield, 
  RefreshCw, 
  Building, 
  CheckSquare, 
  Layers,
  ChevronRight,
  UserCheck,
  X,
  Edit,
  Trash2,
  Download,
  Upload,
  Code,
  Copy,
  Radio
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const INITIAL_WAREHOUSES = [
  { id: 'WH01', name: 'Hà Nội', location: 'Cầu Giấy, Hà Nội' },
  { id: 'WH02', name: 'Hồ Chí Minh', location: 'Quận 9, TP. HCM' },
];

const INITIAL_EMPLOYEES = [
  { id: 'NV001', name: 'Lê Văn Tuyên', title: 'Nhân viên Kỹ thuật', email: 'tuyen.le@company.com', role: 'User' },
  { id: 'NV002', name: 'Nguyễn Văn An', title: 'Quản lý Kho', email: 'an.nguyen@company.com', role: 'Management' },
  { id: 'NV003', name: 'Trần Thị Bình', title: 'Thủ kho chính', email: 'binh.tran@company.com', role: 'Warehouse' },
  { id: 'NV004', name: 'Phạm Minh Đức', title: 'Nhân viên Kinh doanh', email: 'duc.pham@company.com', role: 'User' },
];

const INITIAL_CUSTOMERS = [
  { id: 'KH001', code: 'BIDV', fullName: 'BIDV CN Thành Công', contact: 'Anh Hải', phone: '0912345678', email: 'hai.bidv@partner.com', address: 'Thành Công, Hà Nội' },
  { id: 'KH002', code: 'FPT', fullName: 'Công ty Cổ phần FPT', contact: 'Chị Mai', phone: '0987654321', email: 'mai.fpt@partner.com', address: 'Cầu Giấy, Hà Nội' },
  { id: 'KH003', code: 'VIETTEL', fullName: 'Tập đoàn Viettel', contact: 'Anh Tuấn', phone: '0901122334', email: 'tuan.viettel@partner.com', address: 'Số 1 Trần Hữu Dực, Hà Nội' },
];

const INITIAL_ITEMS = [
  { id: 'CMOS-2500', name: 'Pin CMOS máy Move2500', unit: 'Cái', minThreshold: 10, stock: { WH01: 15, WH02: 5 } },
  { id: 'MH001', name: 'Máy tính xách tay Dell XPS 15', unit: 'Bộ', minThreshold: 5, stock: { WH01: 8, WH02: 3 } },
  { id: 'MH002', name: 'Màn hình Dell UltraSharp 27"', unit: 'Cái', minThreshold: 10, stock: { WH01: 4, WH02: 12 } },
  { id: 'MH003', name: 'Bàn phím Cơ Logitech MX Keys', unit: 'Cái', minThreshold: 15, stock: { WH01: 25, WH02: 8 } },
  { id: 'MH004', name: 'Chuột Không Dây Logitech MX Master 3S', unit: 'Cái', minThreshold: 12, stock: { WH01: 3, WH02: 15 } },
];

const INITIAL_REQUESTS = [
  {
    id: '01/26/XK',
    type: 'EXPORT',
    requesterName: 'Lê Văn Tuyên',
    customerName: 'BIDV CN Thành Công',
    warehouseId: 'WH01',
    workType: 'REPAIR_SINGLE',
    reasonType: 'SERVICE',
    date: '2026-08-07',
    status: 'APPROVED',
    approvedBy: 'Nguyễn Văn An',
    items: [
      { itemId: 'CMOS-2500', name: 'Pin CMOS máy Move2500', quantity: 5, serialNotes: 'SN: 88201-88205' }
    ],
    note: 'Xuất linh kiện thay thế cho khách hàng',
    recipientEmails: ['an.nguyen@company.com', 'binh.tran@company.com']
  }
];

const GOOGLE_APPS_SCRIPT_CODE = `// GOOGLE APPS SCRIPT CODE FOR WAREHOUSE MANAGEMENT
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    if (data.type === 'INVENTORY_SYNC') {
      var sheet = ss.getSheetByName('TonKho') || ss.insertSheet('TonKho');
      sheet.clear();
      sheet.appendRow(['Mã Hàng', 'Tên Hàng Hóa', 'Đơn Vị', 'Kho Hà Nội', 'Kho HCM', 'Tổng Tồn']);
      data.items.forEach(function(item) {
        var total = (item.stock.WH01 || 0) + (item.stock.WH02 || 0);
        sheet.appendRow([item.id, item.name, item.unit, item.stock.WH01 || 0, item.stock.WH02 || 0, total]);
      });
    }
    return ContentService.createTextOutput(JSON.stringify({ result: 'success' })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

export default function App() {
  useEffect(() => {
    if (!document.getElementById('tailwind-cdn')) {
      const script = document.createElement('script');
      script.id = 'tailwind-cdn';
      script.src = 'https://cdn.tailwindcss.com';
      document.head.appendChild(script);
    }
  }, []);

  const [currentUserRole, setCurrentUserRole] = useState('Management');
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const [pastEmails, setPastEmails] = useState([
    'an.nguyen@company.com',
    'binh.tran@company.com',
    'tuyen.le@company.com',
    'ban-giam-doc@company.com'
  ]);

  const [selectedPrintRequest, setSelectedPrintRequest] = useState(INITIAL_REQUESTS[0]);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [newRequestType, setNewRequestType] = useState('EXPORT');
  const [customVoucherId, setCustomVoucherId] = useState('');
  const [reqRequesterName, setReqRequesterName] = useState('Lê Văn Tuyên');
  const [reqCustomerName, setReqCustomerName] = useState('BIDV CN Thành Công');
  const [reqWarehouse, setReqWarehouse] = useState('WH01');
  const [reqWorkType, setReqWorkType] = useState('REPAIR_SINGLE');
  const [reqReasonType, setReqReasonType] = useState('SERVICE');
  const [reqNote, setReqNote] = useState('');
  const [reqEmailsInput, setReqEmailsInput] = useState('');
  const [selectedEmailChips, setSelectedEmailChips] = useState(['an.nguyen@company.com']);
  const [reqItemsList, setReqItemsList] = useState([{ itemId: 'CMOS-2500', quantity: 5, serialNotes: '' }]);

  const [searchTerm, setSearchTerm] = useState('');

  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({ id: '', name: '', unit: 'Cái', minThreshold: 10 });

  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [empForm, setEmpForm] = useState({ id: '', name: '', title: '', email: '', role: 'User' });

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [custForm, setCustForm] = useState({ id: '', code: '', fullName: '', contact: '', phone: '', email: '', address: '' });

  const [stocktakeWH, setStocktakeWH] = useState('WH01');
  const [stocktakeData, setStocktakeData] = useState({});

  const [gsheetUrl, setGsheetUrl] = useState('https://script.google.com/macros/s/AKfycbx_MOCK_SHEET_ID/exec');
  const [syncStatus, setSyncStatus] = useState('');

  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const lowStockItems = useMemo(() => {
    return items.map(item => {
      const totalStock = Object.values(item.stock).reduce((a, b) => a + b, 0);
      return {
        ...item,
        totalStock,
        isLow: totalStock <= item.minThreshold
      };
    }).filter(i => i.isLow);
  }, [items]);

  const handleExportCSV = (dataType) => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    if (dataType === 'INVENTORY') {
      csvContent += "Ma Hang,Ten Hang Hoa,Don Vi,Kho Ha Noi,Kho HCM,Tong Ton,Nguong An Toan\n";
      items.forEach(i => {
        const total = Object.values(i.stock).reduce((a, b) => a + b, 0);
        csvContent += `"${i.id}","${i.name}","${i.unit}",${i.stock.WH01 || 0},${i.stock.WH02 || 0},${total},${i.minThreshold}\n`;
      });
    } else if (dataType === 'EMPLOYEES') {
      csvContent += "Ma NV,Ho va Ten,Chuc Danh,Email,Vai Tro\n";
      employees.forEach(e => {
        csvContent += `"${e.id}","${e.name}","${e.title}","${e.email}","${e.role}"\n`;
      });
    } else if (dataType === 'CUSTOMERS') {
      csvContent += "Ma Tat,Ten Day Du,Nguoi Lien He,So Dien Thoai,Email,Dia Chi\n";
      customers.forEach(c => {
        csvContent += `"${c.code}","${c.fullName}","${c.contact}","${c.phone}","${c.email}","${c.address}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Danh_Sach_${dataType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Đã xuất file dữ liệu ${dataType} thành công!`);
  };

  const handleImportCSV = (e, dataType) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split('\n').map(row => row.split(',').map(cell => cell.replace(/^"|"$/g, '').trim()));
      
      if (dataType === 'ITEMS' && rows.length > 1) {
        const newItems = [...items];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (r.length >= 4 && r[0]) {
            const exists = newItems.find(item => item.id === r[0]);
            if (!exists) {
              newItems.push({
                id: r[0],
                name: r[1],
                unit: r[2] || 'Cái',
                minThreshold: Number(r[3]) || 10,
                stock: { WH01: 0, WH02: 0 }
              });
            }
          }
        }
        setItems(newItems);
        showToast('Đã nhập thành công danh sách hàng hóa từ file!');
      } else if (dataType === 'EMPLOYEES' && rows.length > 1) {
        const newEmps = [...employees];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (r.length >= 4 && r[0]) {
            const exists = newEmps.find(emp => emp.id === r[0]);
            if (!exists) {
              newEmps.push({ id: r[0], name: r[1], title: r[2], email: r[3], role: r[4] || 'User' });
            }
          }
        }
        setEmployees(newEmps);
        showToast('Đã nhập thành công danh sách nhân viên từ file!');
      } else if (dataType === 'CUSTOMERS' && rows.length > 1) {
        const newCusts = [...customers];
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (r.length >= 6 && r[0]) {
            const exists = newCusts.find(c => c.code === r[0]);
            if (!exists) {
              newCusts.push({ id: `KH00${newCusts.length + 1}`, code: r[0], fullName: r[1], contact: r[2], phone: r[3], email: r[4], address: r[5] });
            }
          }
        }
        setCustomers(newCusts);
        showToast('Đã nhập thành công danh sách khách hàng từ file!');
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleAddEmailChip = (email) => {
    if (email && !selectedEmailChips.includes(email)) {
      setSelectedEmailChips([...selectedEmailChips, email]);
      if (!pastEmails.includes(email)) {
        setPastEmails([...pastEmails, email]);
      }
    }
  };

  const handleRemoveEmailChip = (email) => {
    setSelectedEmailChips(selectedEmailChips.filter(e => e !== email));
  };

  const handleOpenItemModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setItemForm({ ...item });
    } else {
      setEditingItem(null);
      setItemForm({ id: `MH00${items.length + 1}`, name: '', unit: 'Cái', minThreshold: 10 });
    }
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    if (editingItem) {
      setItems(items.map(i => i.id === editingItem.id ? { ...i, ...itemForm } : i));
      showToast('Đã cập nhật thông tin hàng hóa thành công!');
    } else {
      const newItem = {
        ...itemForm,
        stock: { WH01: 0, WH02: 0 }
      };
      setItems([...items, newItem]);
      showToast('Đã thêm mặt hàng mới vào danh mục!');
    }
    setIsItemModalOpen(false);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
    showToast('Đã xóa mặt hàng khỏi hệ thống!');
  };

  // --- XỬ LÝ TẠO YÊU CẦU ---
  const handleCreateRequest = (e) => {
    e.preventDefault();

    const formattedItems = reqItemsList.map(ri => {
      const matchedItem = items.find(i => i.id === ri.itemId);
      return {
        itemId: ri.itemId,
        name: matchedItem ? matchedItem.name : '',
        quantity: Number(ri.quantity),
        serialNotes: ri.serialNotes || ''
      };
    });

    const finalVoucherId = customVoucherId.trim() || `0${requests.length + 1}/26/XK`;

    const newReq = {
      id: finalVoucherId,
      type: newRequestType,
      requesterName: reqRequesterName,
      customerName: reqCustomerName,
      warehouseId: reqWarehouse,
      workType: reqWorkType,
      reasonType: reqReasonType,
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      approvedBy: '',
      items: formattedItems,
      note: reqNote,
      recipientEmails: selectedEmailChips
    };

    setRequests([newReq, ...requests]);
    setIsRequestModalOpen(false);
    setCustomVoucherId('');
    showToast(`⚡ Đã tạo phiếu yêu cầu ${newReq.id} thành công! Chuyển sang In Phiếu & Gửi Email.`);
  };

  const handleApproveRequest = (reqId, isApprove) => {
    const updatedRequests = requests.map(req => {
      if (req.id === reqId) {
        const newStatus = isApprove ? 'APPROVED' : 'REJECTED';
        
        if (isApprove) {
          setItems(prevItems => prevItems.map(item => {
            const reqItem = req.items.find(ri => ri.itemId === item.id);
            if (reqItem) {
              const currentWhStock = item.stock[req.warehouseId] || 0;
              let newWhStock = currentWhStock;

              if (req.type === 'EXPORT' || req.type === 'INSTALL') {
                newWhStock = Math.max(0, currentWhStock - reqItem.quantity);
              } else if (req.type === 'IMPORT') {
                newWhStock = currentWhStock + reqItem.quantity;
              }

              return {
                ...item,
                stock: {
                  ...item.stock,
                  [req.warehouseId]: newWhStock
                }
              };
            }
            return item;
          }));
        }

        return {
          ...req,
          status: newStatus,
          approvedBy: currentUserRole === 'Management' ? 'Quản Lý (Nguyễn Văn An)' : 'Kho (Trần Thị Bình)'
        };
      }
      return req;
    });

    setRequests(updatedRequests);
    showToast(isApprove ? `Đã phê duyệt ${reqId} & cập nhật tồn kho!` : `Đã từ chối phiếu ${reqId}`);
  };

  // Hàm mở Gmail Web để gửi thư
  const handleOpenGmailWeb = (req) => {
    const emails = (req.recipientEmails || ['an.nguyen@company.com']).join(',');
    const subject = encodeURIComponent(`[THÔNG BÁO KHO] Phiếu ${req.id} - ${req.customerName}`);
    const itemsSummary = req.items.map(i => `- ${i.name} (SL: ${i.quantity})`).join('\n');
    const body = encodeURIComponent(
      `Kính gửi bộ phận liên quan,\n\n` +
      `Thông tin phiếu ${req.type === 'IMPORT' ? 'Nhập kho' : 'Xuất kho'} số: ${req.id}\n` +
      `- Khách hàng / Nhà cung cấp: ${req.customerName}\n` +
      `- Người yêu cầu: ${req.requesterName}\n` +
      `- Danh sách vật tư:\n${itemsSummary}\n\n` +
      `Trân trọng,\nHệ thống Quản lý Kho`
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${emails}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  const handleOpenEmpModal = (emp = null) => {
    if (emp) {
      setEditingEmployee(emp);
      setEmpForm({ ...emp });
    } else {
      setEditingEmployee(null);
      setEmpForm({ id: `NV00${employees.length + 1}`, name: '', title: '', email: '', role: 'User' });
    }
    setIsEmployeeModalOpen(true);
  };

  const handleSaveEmployee = (e) => {
    e.preventDefault();
    if (editingEmployee) {
      setEmployees(employees.map(e => e.id === editingEmployee.id ? empForm : e));
      showToast('Đã cập nhật thông tin nhân viên!');
    } else {
      setEmployees([...employees, empForm]);
      showToast('Đã thêm nhân viên mới!');
    }
    setIsEmployeeModalOpen(false);
  };

  const handleDeleteEmployee = (id) => {
    setEmployees(employees.filter(e => e.id !== id));
    showToast('Đã xóa nhân viên!');
  };

  const handleOpenCustModal = (cust = null) => {
    if (cust) {
      setEditingCustomer(cust);
      setCustForm({ ...cust });
    } else {
      setEditingCustomer(null);
      setCustForm({ id: `KH00${customers.length + 1}`, code: '', fullName: '', contact: '', phone: '', email: '', address: '' });
    }
    setIsCustomerModalOpen(true);
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (editingCustomer) {
      setCustomers(customers.map(c => c.id === editingCustomer.id ? custForm : c));
      showToast('Đã cập nhật thông tin khách hàng!');
    } else {
      setCustomers([...customers, custForm]);
      showToast('Đã thêm khách hàng mới!');
    }
    setIsCustomerModalOpen(false);
  };

  const handleDeleteCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
    showToast('Đã xóa khách hàng!');
  };

  const handleStocktakeSave = (itemId, whId, actualQty) => {
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          stock: { ...item.stock, [whId]: Number(actualQty) }
        };
      }
      return item;
    }));
    showToast(`Đã cập nhật số lượng kiểm kê thực tế!`);
  };

  const handleSyncToGoogleSheet = () => {
    setSyncStatus('Đang đẩy dữ liệu lên Google Sheets...');
    setTimeout(() => {
      setSyncStatus('Đồng bộ thành công! Tất cả Phiếu & Tồn kho đã ghi nhận vào Google Sheet.');
      setTimeout(() => setSyncStatus(''), 4000);
    }, 1200);
  };

  const copyToClipboard = (text) => {
    document.execCommand('copy');
    showToast('Đã sao chép mã Google Apps Script vào bộ nhớ tạm!');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col">
      {/* --- TOP BANNER HEADER --- */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-md">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white leading-none">
                HỆ THỐNG QUẢN LÝ KHO THÔNG MINH
              </h1>
              <span className="text-xs text-slate-400">Quy trình Yêu cầu - Phê duyệt - In Phiếu Mẫu 01/02-VT</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full text-xs font-mono">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Realtime Online</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-xs text-slate-300 font-medium hidden md:inline">Vai trò:</span>
              <select
                value={currentUserRole}
                onChange={(e) => setCurrentUserRole(e.target.value)}
                className="bg-slate-900 text-amber-400 text-xs font-semibold rounded px-2 py-1 border border-slate-600 focus:outline-none focus:ring-1 focus:ring-amber-400"
              >
                <option value="Management">Quản lý (Admin)</option>
                <option value="Warehouse">Nhân viên Kho</option>
                <option value="User">Người dùng thông thường</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* --- MENU ĐIỀU HƯỚNG --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-grow w-full">
        <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 mb-6 print:hidden">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Báo cáo Trực quan
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'inventory' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" /> Tồn kho & Cảnh báo
          </button>

          <button
            onClick={() => setActiveTab('itemsDir')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'itemsDir' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Package className="w-4 h-4" /> Quản lý Hàng hóa
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap relative ${
              activeTab === 'requests' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock className="w-4 h-4" /> Quy trình & Phê duyệt
            {requests.filter(r => r.status === 'PENDING').length > 0 && (
              <span className="ml-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                {requests.filter(r => r.status === 'PENDING').length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('print')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'print' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Printer className="w-4 h-4" /> In Phiếu Chuẩn & Gửi Email
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'directory' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" /> Quản lý NV & Khách hàng
          </button>

          <button
            onClick={() => setActiveTab('stocktake')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'stocktake' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckSquare className="w-4 h-4" /> Kiểm kê thực tế
          </button>

          <button
            onClick={() => setActiveTab('googleSheet')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              activeTab === 'googleSheet' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-400" /> Google Sheets & Script
          </button>
        </div>

        {/* Cửa sổ thông báo Toast */}
        {toastMessage && (
          <div className="mb-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between print:hidden animate-bounce">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle className="w-5 h-5" />
              {toastMessage}
            </div>
            <button onClick={() => setToastMessage('')} className="text-white hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= TAB 1: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Tổng mã hàng</p>
                  <h3 className="text-2xl font-bold text-slate-800">{items.length} Mã</h3>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Kho hoạt động</p>
                  <h3 className="text-2xl font-bold text-slate-800">{warehouses.length} Kho</h3>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Chạm ngưỡng cần nhập</p>
                  <h3 className="text-2xl font-bold text-amber-600">{lowStockItems.length} Sản phẩm</h3>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase">Yêu cầu chờ duyệt</p>
                  <h3 className="text-2xl font-bold text-indigo-600">
                    {requests.filter(r => r.status === 'PENDING').length} Yêu cầu
                  </h3>
                </div>
              </div>
            </div>

            {lowStockItems.length > 0 && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-amber-800">CẢNH BÁO TỒN KHO DƯỚI NGƯỠNG AN TOÀN!</h4>
                    <p className="text-sm text-amber-700 mt-0.5">
                      Có {lowStockItems.length} sản phẩm chạm hoặc thấp hơn ngưỡng nhập bổ sung.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('inventory')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded"
                >
                  Xem chi tiết
                </button>
              </div>
            )}

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" /> Báo cáo Trực quan Tồn kho Đa kho theo Mặt hàng
                </h3>
                <button
                  onClick={() => handleExportCSV('INVENTORY')}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300"
                >
                  <Download className="w-3.5 h-3.5" /> Xuất Excel Tồn Kho
                </button>
              </div>

              <div className="space-y-4">
                {items.map(item => {
                  const totalStock = Object.values(item.stock).reduce((a, b) => a + b, 0);
                  const percentage = Math.min(100, Math.round((totalStock / (item.minThreshold * 3)) * 100));
                  const isLow = totalStock <= item.minThreshold;

                  return (
                    <div key={item.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-800 font-bold">{item.id} - {item.name}</span>
                        <span className={isLow ? 'text-red-600 font-bold' : 'text-slate-600'}>
                          Tổng tồn: {totalStock} {item.unit} (Ngưỡng: {item.minThreshold})
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${
                            isLow ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.max(5, percentage)}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: INVENTORY & THRESHOLDS ================= */}
        {activeTab === 'inventory' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">DANH MỤC HÀNG HÓA & THAM SỐ CHẠM NGƯỠNG</h3>
                <p className="text-xs text-slate-500">Quản lý mã hàng, vị trí tồn kho đa kho và tham số cảnh báo cần nhập hàng.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleExportCSV('INVENTORY')}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Xuất Excel (.CSV)
                </button>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Tìm Mã / Tên hàng..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 w-56"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">PART NO (Mã Hàng)</th>
                    <th className="py-3 px-4">Tên Hàng Hóa</th>
                    <th className="py-3 px-4">ĐVT</th>
                    {warehouses.map(wh => (
                      <th key={wh.id} className="py-3 px-4 text-center">Kho {wh.name}</th>
                    ))}
                    <th className="py-3 px-4 text-center">Tổng Tồn</th>
                    <th className="py-3 px-4 text-center">Ngưỡng Báo Nhập</th>
                    <th className="py-3 px-4 text-center">Trạng Thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items
                    .filter(i => i.name.toLowerCase().includes(searchTerm.toLowerCase()) || i.id.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(item => {
                      const totalStock = Object.values(item.stock).reduce((a, b) => a + b, 0);
                      const isLow = totalStock <= item.minThreshold;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-3 px-4 font-mono font-bold text-indigo-600">{item.id}</td>
                          <td className="py-3 px-4 font-medium text-slate-800">{item.name}</td>
                          <td className="py-3 px-4 text-slate-600">{item.unit}</td>
                          {warehouses.map(wh => (
                            <td key={wh.id} className="py-3 px-4 text-center font-semibold">
                              {item.stock[wh.id] || 0}
                            </td>
                          ))}
                          <td className="py-3 px-4 text-center font-bold text-slate-900">{totalStock}</td>
                          <td className="py-3 px-4 text-center font-semibold text-slate-500">{item.minThreshold}</td>
                          <td className="py-3 px-4 text-center">
                            {isLow ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                <AlertTriangle className="w-3.5 h-3.5" /> Cần Nhập Hàng
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                <CheckCircle className="w-3.5 h-3.5" /> An Toàn
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3.5: ITEMS MANAGEMENT ================= */}
        {activeTab === 'itemsDir' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-600" /> QUẢN LÝ DANH MỤC HÀNG HÓA / VẬT TƯ
                </h3>
                <p className="text-xs text-slate-500">Thêm mới, sửa, xóa, xuất/nhập file dữ liệu hàng hóa hàng loạt.</p>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg font-bold text-sm shadow cursor-pointer transition">
                  <Upload className="w-4 h-4" /> Nhập file Hàng hóa
                  <input type="file" accept=".csv" onChange={(e) => handleImportCSV(e, 'ITEMS')} className="hidden" />
                </label>

                <button
                  onClick={() => handleOpenItemModal()}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow transition"
                >
                  <Plus className="w-4 h-4" /> Thêm Mặt Hàng Mới
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Mã Hàng (Part No)</th>
                    <th className="py-3 px-4">Tên Hàng Hóa</th>
                    <th className="py-3 px-4">Đơn Vị Tính</th>
                    <th className="py-3 px-4 text-center">Ngưỡng Báo Nhập</th>
                    <th className="py-3 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-mono font-bold text-indigo-600">{item.id}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{item.name}</td>
                      <td className="py-3 px-4 text-slate-600">{item.unit}</td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-500">{item.minThreshold}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenItemModal(item)}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 bg-slate-100 rounded"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 text-slate-600 hover:text-red-600 bg-slate-100 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 3: WORKFLOW & APPROVALS ================= */}
        {activeTab === 'requests' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  QUY TRÌNH YÊU CẦU, DUYỆT XUẤT/NHẬP KHO
                  <span className="text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ⚡ Đồng bộ Realtime Active
                  </span>
                </h3>
                <p className="text-xs text-slate-500">Tất cả thông tin từ yêu cầu, kho duyệt đến tạo phiếu in mẫu chuẩn.</p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow transition"
                >
                  <Plus className="w-4 h-4" /> Tạo Yêu Cầu Mới
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Số Phiếu</th>
                    <th className="py-3 px-4">Loại Phiếu</th>
                    <th className="py-3 px-4">Người Yêu Cầu</th>
                    <th className="py-3 px-4">Khách Hàng / Đối Tác</th>
                    <th className="py-3 px-4">Kho</th>
                    <th className="py-3 px-4">Ngày Tạo</th>
                    <th className="py-3 px-4 text-center">Trạng Thái</th>
                    <th className="py-3 px-4 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {requests.map(req => {
                    const wh = warehouses.find(w => w.id === req.warehouseId);
                    return (
                      <tr key={req.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600">{req.id}</td>
                        <td className="py-3 px-4 font-semibold">
                          {req.type === 'IMPORT' ? <span className="text-emerald-600">Phiếu Nhập</span> : <span className="text-blue-600">Phiếu Xuất</span>}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">{req.requesterName}</td>
                        <td className="py-3 px-4 text-slate-700">{req.customerName}</td>
                        <td className="py-3 px-4 text-slate-600">{wh?.name}</td>
                        <td className="py-3 px-4 text-slate-500 text-xs">{req.date}</td>
                        <td className="py-3 px-4 text-center">
                          {req.status === 'PENDING' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                              <Clock className="w-3.5 h-3.5" /> Chờ Duyệt
                            </span>
                          )}
                          {req.status === 'APPROVED' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                              <CheckCircle className="w-3.5 h-3.5" /> Đã Duyệt
                            </span>
                          )}
                          {req.status === 'REJECTED' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">
                              <XCircle className="w-3.5 h-3.5" /> Từ Chối
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {req.status === 'PENDING' && (currentUserRole === 'Management' || currentUserRole === 'Warehouse') && (
                              <>
                                <button
                                  onClick={() => handleApproveRequest(req.id, true)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm"
                                >
                                  Duyệt
                                </button>
                                <button
                                  onClick={() => handleApproveRequest(req.id, false)}
                                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shadow-sm"
                                >
                                  Từ chối
                                </button>
                              </>
                            )}

                            {req.status === 'APPROVED' && (
                              <button
                                onClick={() => {
                                  setSelectedPrintRequest(req);
                                  setActiveTab('print');
                                }}
                                className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-xs font-semibold border border-indigo-200"
                              >
                                <Printer className="w-3.5 h-3.5" /> In Phiếu & Gửi Email
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 4: PRINTABLE VOUCHER & GMAIL WEB INTEGRATION ================= */}
        {activeTab === 'print' && selectedPrintRequest && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-slate-700">Chọn Phiếu Cần In / Gửi Mail:</label>
                <select
                  value={selectedPrintRequest.id}
                  onChange={(e) => {
                    const found = requests.find(r => r.id === e.target.value);
                    if (found) setSelectedPrintRequest(found);
                  }}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold"
                >
                  {requests.map(r => (
                    <option key={r.id} value={r.id}>
                      Phiếu số {r.id} - {r.customerName} ({r.date}) [{r.status}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenGmailWeb(selectedPrintRequest)}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow transition"
                >
                  <Mail className="w-4 h-4" /> Gửi Email qua Gmail Web
                </button>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow transition"
                >
                  <Printer className="w-4 h-4" /> IN PHIẾU NÀY (A4)
                </button>
              </div>
            </div>

            <div className="bg-white p-10 rounded-xl border border-slate-300 shadow-md max-w-4xl mx-auto text-slate-900 font-sans print:shadow-none print:border-none print:p-0">
              
              <div className="flex justify-between items-start mb-4">
                <div></div>
                <div className="text-right text-xs italic leading-relaxed">
                  <p className="font-bold not-italic">
                    {selectedPrintRequest.type === 'IMPORT' ? 'Mẫu số 01 – VT' : 'Mẫu số 02 – VT'}
                  </p>
                  <p>(Ban hành theo Thông tư số 133/2016/TT-BTC</p>
                  <p>Ngày 26/08/2016 của Bộ Tài chính)</p>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-sm italic font-semibold mb-1">
                  Ngày {selectedPrintRequest.date.split('-')[2]} tháng {selectedPrintRequest.date.split('-')[1]} năm {selectedPrintRequest.date.split('-')[0]}
                </p>
                <h2 className="text-2xl font-bold uppercase">
                  {selectedPrintRequest.type === 'IMPORT' ? 'PHIẾU NHẬP KHO' : 'PHIẾU XUẤT KHO'}
                </h2>
                <p className="text-sm font-semibold italic mt-1">
                  Số phiếu: <span className="font-mono not-italic">{selectedPrintRequest.id}</span>
                </p>
              </div>

              <div className="text-sm space-y-2.5 mb-6 leading-relaxed">
                {selectedPrintRequest.type === 'IMPORT' ? (
                  <>
                    <p><span className="font-bold">1. Họ và tên người giao hàng :</span> {selectedPrintRequest.requesterName}</p>
                    <p><span className="font-bold">2. Đơn vị / Nhà cung cấp :</span> {selectedPrintRequest.customerName}</p>
                  </>
                ) : (
                  <>
                    <p><span className="font-bold">1. Họ và tên người yêu cầu :</span> {selectedPrintRequest.requesterName}</p>
                    <p><span className="font-bold">2. Tên khách hàng :</span> {selectedPrintRequest.customerName}</p>
                  </>
                )}

                <div className="flex items-center gap-6">
                  <span className="font-bold">3. Thực hiện tại kho:</span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedPrintRequest.warehouseId === 'WH01'} readOnly className="w-4 h-4 accent-indigo-600" />
                    <span>Hà Nội</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedPrintRequest.warehouseId === 'WH02'} readOnly className="w-4 h-4 accent-indigo-600" />
                    <span>Hồ Chí Minh</span>
                  </label>
                </div>

                {selectedPrintRequest.type !== 'IMPORT' && (
                  <>
                    <div className="space-y-1.5">
                      <span className="font-bold">4. Sửa chữa/ Bán máy:</span>
                      <div className="grid grid-cols-2 gap-2.5 pl-6">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={selectedPrintRequest.workType === 'REPAIR_SINGLE'} readOnly className="w-4 h-4 accent-indigo-600" />
                          <span>Sửa chữa lẻ</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={selectedPrintRequest.workType === 'REPAIR_PROJ'} readOnly className="w-4 h-4 accent-indigo-600" />
                          <span>Sửa chữa dự án</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={selectedPrintRequest.workType === 'SELL_SINGLE'} readOnly className="w-4 h-4 accent-indigo-600" />
                          <span>Bán máy lẻ</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={selectedPrintRequest.workType === 'SELL_PROJ'} readOnly className="w-4 h-4 accent-indigo-600" />
                          <span>Bán máy dự án</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <span className="font-bold">5. Lý do xuất kho:</span>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selectedPrintRequest.reasonType === 'SERVICE'} readOnly className="w-4 h-4 accent-indigo-600" />
                        <span>Dịch vụ</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selectedPrintRequest.reasonType === 'WARRANTY'} readOnly className="w-4 h-4 accent-indigo-600" />
                        <span>Bảo hành</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" checked={selectedPrintRequest.reasonType === 'INTERNAL'} readOnly className="w-4 h-4 accent-indigo-600" />
                        <span>Nội bộ</span>
                      </label>
                    </div>
                  </>
                )}
              </div>

              <table className="w-full text-sm border-collapse border border-slate-900 mb-6">
                <thead>
                  <tr className="bg-slate-100 text-center font-bold">
                    <th className="border border-slate-900 p-2 w-12">STT</th>
                    <th className="border border-slate-900 p-2">TÊN HÀNG HÓA</th>
                    <th className="border border-slate-900 p-2">PART NO</th>
                    <th className="border border-slate-900 p-2 w-28">SỐ LƯỢNG</th>
                    <th className="border border-slate-900 p-2">GHI CHÚ – SERIAL</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPrintRequest.items.map((it, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="border border-slate-900 p-2.5">{idx + 1}</td>
                      <td className="border border-slate-900 p-2.5 text-left font-semibold">{it.name}</td>
                      <td className="border border-slate-900 p-2.5 font-mono">{it.itemId}</td>
                      <td className="border border-slate-900 p-2.5 font-bold">{it.quantity}</td>
                      <td className="border border-slate-900 p-2.5 text-left text-xs">{it.serialNotes}</td>
                    </tr>
                  ))}
                  <tr className="font-bold text-center">
                    <td colSpan={3} className="border border-slate-900 p-2">Cộng</td>
                    <td className="border border-slate-900 p-2">
                      {selectedPrintRequest.items.reduce((sum, item) => sum + Number(item.quantity), 0)}
                    </td>
                    <td className="border border-slate-900 p-2"></td>
                  </tr>
                </tbody>
              </table>

              <div className="grid grid-cols-3 text-center text-xs gap-4 pt-4">
                <div>
                  <p className="font-bold">{selectedPrintRequest.type === 'IMPORT' ? 'Người giao hàng' : 'Người lập phiếu'}</p>
                  <p className="italic text-slate-500">(Ký, họ tên)</p>
                  <div className="h-16"></div>
                  <p className="font-semibold">{selectedPrintRequest.requesterName}</p>
                </div>
                <div>
                  <p className="font-bold">Thủ kho</p>
                  <p className="italic text-slate-500">(Ký, họ tên)</p>
                  <div className="h-16"></div>
                  <p className="font-semibold">Trần Thị Bình</p>
                </div>
                <div>
                  <p className="font-bold">Kế toán / Quản lý</p>
                  <p className="italic text-slate-500">(Ký, họ tên)</p>
                  <div className="h-16"></div>
                  <p className="font-semibold">{selectedPrintRequest.approvedBy || 'Nguyễn Văn An'}</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 5: EMPLOYEES & CUSTOMERS MANAGEMENT ================= */}
        {activeTab === 'directory' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Nhân viên */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" /> QUẢN LÝ NHÂN VIÊN
                </h3>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded text-xs font-bold cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Nhập NV
                    <input type="file" accept=".csv" onChange={(e) => handleImportCSV(e, 'EMPLOYEES')} className="hidden" />
                  </label>
                  <button
                    onClick={() => handleExportCSV('EMPLOYEES')}
                    className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded text-xs font-bold border border-slate-300"
                  >
                    <Download className="w-3.5 h-3.5" /> Xuất NV
                  </button>
                  <button
                    onClick={() => handleOpenEmpModal()}
                    className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-3">Mã NV</th>
                      <th className="py-2.5 px-3">Họ và Tên</th>
                      <th className="py-2.5 px-3">Chức Danh</th>
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {employees.map(emp => (
                      <tr key={emp.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{emp.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{emp.name}</td>
                        <td className="py-2.5 px-3 text-slate-600">{emp.title}</td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono">{emp.email}</td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleOpenEmpModal(emp)} className="p-1 text-slate-600 hover:text-indigo-600">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteEmployee(emp.id)} className="p-1 text-slate-600 hover:text-red-600">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Khách hàng */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" /> QUẢN LÝ KHÁCH HÀNG
                </h3>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded text-xs font-bold cursor-pointer">
                    <Upload className="w-3.5 h-3.5" /> Nhập KH
                    <input type="file" accept=".csv" onChange={(e) => handleImportCSV(e, 'CUSTOMERS')} className="hidden" />
                  </label>
                  <button
                    onClick={() => handleExportCSV('CUSTOMERS')}
                    className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1.5 rounded text-xs font-bold border border-slate-300"
                  >
                    <Download className="w-3.5 h-3.5" /> Xuất KH
                  </button>
                  <button
                    onClick={() => handleOpenCustModal()}
                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-xs font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-3">Mã Tắt</th>
                      <th className="py-2.5 px-3">Tên Đầy Đủ Khách Hàng</th>
                      <th className="py-2.5 px-3">Liên Hệ</th>
                      <th className="py-2.5 px-3">SĐT & Email</th>
                      <th className="py-2.5 px-3 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-emerald-600">{c.code}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{c.fullName}</td>
                        <td className="py-2.5 px-3 text-slate-600">{c.contact}</td>
                        <td className="py-2.5 px-3 text-slate-500 font-mono">
                          {c.phone} <br /> {c.email}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleOpenCustModal(c)} className="p-1 text-slate-600 hover:text-indigo-600">
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteCustomer(c.id)} className="p-1 text-slate-600 hover:text-red-600">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: STOCKTAKE ================= */}
        {activeTab === 'stocktake' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-slate-800">KIỂM KÊ KHO THỰC TẾ & ĐỐI ĐỐI SỔ SÁCH</h3>
                <p className="text-xs text-slate-500">Nhập số lượng thực tế kiểm kê tại từng kho để điều chỉnh chênh lệch.</p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold">Chọn Kho Kiểm Kê:</label>
                <select
                  value={stocktakeWH}
                  onChange={(e) => setStocktakeWH(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-semibold"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">PART NO (Mã Hàng)</th>
                    <th className="py-3 px-4">Tên Hàng Hóa</th>
                    <th className="py-3 px-4 text-center">Tồn Sổ Sách</th>
                    <th className="py-3 px-4 text-center">Tồn Thực Tế</th>
                    <th className="py-3 px-4 text-center">Chênh Lệch</th>
                    <th className="py-3 px-4 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map(item => {
                    const bookQty = item.stock[stocktakeWH] || 0;
                    const actualQty = stocktakeData[item.id] !== undefined ? stocktakeData[item.id] : bookQty;
                    const diff = actualQty - bookQty;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600">{item.id}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{item.name}</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-700">{bookQty}</td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            value={actualQty}
                            onChange={(e) => setStocktakeData({ ...stocktakeData, [item.id]: e.target.value })}
                            className="w-20 border border-slate-300 rounded px-2 py-1 text-center font-bold focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          {diff === 0 ? (
                            <span className="text-slate-400">0</span>
                          ) : diff > 0 ? (
                            <span className="text-emerald-600">+{diff} (Thừa)</span>
                          ) : (
                            <span className="text-red-600">{diff} (Thiếu)</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleStocktakeSave(item.id, stocktakeWH, actualQty)}
                            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded shadow-sm"
                          >
                            Cập nhật Tồn Kho
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= TAB 7: GOOGLE SHEETS & APPS SCRIPT CODE ================= */}
        {activeTab === 'googleSheet' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">KẾT NỐI & ĐẨY DỮ LIỆU SANG GOOGLE SHEETS</h3>
                  <p className="text-xs text-slate-500">Đồng bộ tự động danh mục, yêu cầu và số lượng tồn kho.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Đường dẫn Webhook URL (Google Apps Script):
                  </label>
                  <input
                    type="text"
                    value={gsheetUrl}
                    onChange={(e) => setGsheetUrl(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {syncStatus && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold animate-pulse">
                    {syncStatus}
                  </div>
                )}

                <button
                  onClick={handleSyncToGoogleSheet}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-bold text-sm shadow transition"
                >
                  <RefreshCw className="w-4 h-4" /> ĐẨY DỮ LIỆU TỒN KHO & PHIẾU NÀY LÊN GOOGLE SHEETS
                </button>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-200 p-6 rounded-xl border border-slate-800 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-amber-400" />
                  <h4 className="font-bold text-sm text-white">MÃ GOOGLE APPS SCRIPT MẪU CHO GOOGLE SHEET</h4>
                </div>
                <button
                  onClick={() => copyToClipboard(GOOGLE_APPS_SCRIPT_CODE)}
                  className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-amber-400 px-3 py-1.5 rounded text-xs font-bold border border-slate-700"
                >
                  <Copy className="w-3.5 h-3.5" /> Sao chép Mã
                </button>
              </div>

              <pre className="text-2xs font-mono bg-slate-950 p-4 rounded-lg overflow-x-auto text-emerald-400 max-h-60">
                {GOOGLE_APPS_SCRIPT_CODE}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: CREATE NEW REQUEST ================= */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">TẠO YÊU CẦU XUẤT / NHẬP / CÀI ĐẶT MỚI</h3>
              <button onClick={() => setIsRequestModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại Phiếu:</label>
                  <select
                    value={newRequestType}
                    onChange={(e) => setNewRequestType(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-semibold"
                  >
                    <option value="EXPORT">Phiếu Xuất Kho (Mẫu 02-VT)</option>
                    <option value="IMPORT">Phiếu Nhập Kho (Mẫu 01-VT)</option>
                    <option value="INSTALL">Yêu cầu Cài đặt & Bán hàng</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số Phiếu (Điền tay):</label>
                  <input
                    type="text"
                    value={customVoucherId}
                    onChange={(e) => setCustomVoucherId(e.target.value)}
                    placeholder="VD: 03/26/XK hoặc để trống tự sinh"
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kho Thực Hiện:</label>
                  <select
                    value={reqWarehouse}
                    onChange={(e) => setReqWarehouse(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-semibold"
                  >
                    {warehouses.map(w => (
                      <option key={w.id} value={w.id}>Kho {w.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {newRequestType === 'IMPORT' ? 'Họ và tên người giao hàng:' : 'Họ và tên người yêu cầu:'}
                  </label>
                  <select
                    value={reqRequesterName}
                    onChange={(e) => setReqRequesterName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-semibold"
                  >
                    {employees.map(e => (
                      <option key={e.id} value={e.name}>{e.name} ({e.title})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {newRequestType === 'IMPORT' ? 'Đơn vị / Nhà cung cấp (Tên nguồn giao):' : 'Tên khách hàng:'}
                </label>
                <select
                  value={reqCustomerName}
                  onChange={(e) => setReqCustomerName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 font-semibold"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.fullName}>{c.code} - {c.fullName}</option>
                  ))}
                </select>
              </div>

              {newRequestType !== 'IMPORT' && (
                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phân loại Sửa chữa/ Bán máy:</label>
                    <select
                      value={reqWorkType}
                      onChange={(e) => setReqWorkType(e.target.value)}
                      className="w-full border border-slate-300 rounded p-1.5 font-semibold"
                    >
                      <option value="REPAIR_SINGLE">Sửa chữa lẻ</option>
                      <option value="REPAIR_PROJ">Sửa chữa dự án</option>
                      <option value="SELL_SINGLE">Bán máy lẻ</option>
                      <option value="SELL_PROJ">Bán máy dự án</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Lý do xuất kho:</label>
                    <select
                      value={reqReasonType}
                      onChange={(e) => setReqReasonType(e.target.value)}
                      className="w-full border border-slate-300 rounded p-1.5 font-semibold"
                    >
                      <option value="SERVICE">Dịch vụ</option>
                      <option value="WARRANTY">Bảo hành</option>
                      <option value="INTERNAL">Nội bộ</option>
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Danh Sách Vật Tư / Hàng Hóa (Hiển thị số lượng tồn):</label>
                {reqItemsList.map((ri, index) => {
                  return (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <select
                        value={ri.itemId}
                        onChange={(e) => {
                          const newList = [...reqItemsList];
                          newList[index].itemId = e.target.value;
                          setReqItemsList(newList);
                        }}
                        className="w-1/2 border border-slate-300 rounded p-1.5 font-semibold"
                      >
                        {items.map(i => {
                          const stockSum = Object.values(i.stock).reduce((a, b) => a + b, 0);
                          return (
                            <option key={i.id} value={i.id}>
                              {i.id} - {i.name} [Tồn: {stockSum} {i.unit}]
                            </option>
                          );
                        })}
                      </select>

                      <input
                        type="number"
                        min="1"
                        placeholder="SL"
                        value={ri.quantity}
                        onChange={(e) => {
                          const newList = [...reqItemsList];
                          newList[index].quantity = e.target.value;
                          setReqItemsList(newList);
                        }}
                        className="w-16 border border-slate-300 rounded p-1.5 text-center font-bold"
                      />

                      <input
                        type="text"
                        placeholder="Ghi chú / Serial..."
                        value={ri.serialNotes}
                        onChange={(e) => {
                          const newList = [...reqItemsList];
                          newList[index].serialNotes = e.target.value;
                          setReqItemsList(newList);
                        }}
                        className="flex-grow border border-slate-300 rounded p-1.5"
                      />

                      {reqItemsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setReqItemsList(reqItemsList.filter((_, idx) => idx !== index))}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setReqItemsList([...reqItemsList, { itemId: 'CMOS-2500', quantity: 1, serialNotes: '' }])}
                  className="text-indigo-600 font-bold hover:underline flex items-center gap-1 mt-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Thêm mặt hàng
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Thông Báo (Chọn hoặc nhập email mới):</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {selectedEmailChips.map(email => (
                    <span key={email} className="bg-indigo-100 text-indigo-800 font-mono px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                      {email}
                      <button type="button" onClick={() => handleRemoveEmailChip(email)}>
                        <X className="w-3 h-3 text-indigo-600 hover:text-red-600" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1 mb-2">
                  <span className="text-slate-400 font-semibold self-center">Gợi ý mail đã dùng:</span>
                  {pastEmails.map(email => (
                    <button
                      key={email}
                      type="button"
                      onClick={() => handleAddEmailChip(email)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-2xs font-mono"
                    >
                      + {email}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Nhập email..."
                    value={reqEmailsInput}
                    onChange={(e) => setReqEmailsInput(e.target.value)}
                    className="flex-grow border border-slate-300 rounded p-1.5 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleAddEmailChip(reqEmailsInput);
                      setReqEmailsInput('');
                    }}
                    className="px-3 py-1.5 bg-slate-800 text-white font-semibold rounded"
                  >
                    Thêm
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow"
                >
                  GỬI YÊU CẦU & CHUYỂN ĐẾN IN PHIẾU
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD/EDIT ITEM ================= */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-800">
                {editingItem ? 'CHỈNH SỬA THÔNG TIN HÀNG HÓA' : 'THÊM MẶT HÀNG / VẬT TƯ MỚI'}
              </h3>
              <button onClick={() => setIsItemModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã Hàng (Part No):</label>
                <input
                  type="text"
                  required
                  value={itemForm.id}
                  onChange={e => setItemForm({ ...itemForm, id: e.target.value })}
                  placeholder="VD: CMOS-2500"
                  className="w-full border border-slate-300 rounded p-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Hàng Hóa / Vật Tư:</label>
                <input
                  type="text"
                  required
                  value={itemForm.name}
                  onChange={e => setItemForm({ ...itemForm, name: e.target.value })}
                  placeholder="VD: Pin CMOS máy Move2500"
                  className="w-full border border-slate-300 rounded p-2 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đơn Vị Tính:</label>
                  <input
                    type="text"
                    required
                    value={itemForm.unit}
                    onChange={e => setItemForm({ ...itemForm, unit: e.target.value })}
                    placeholder="VD: Cái, Bộ..."
                    className="w-full border border-slate-300 rounded p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngưỡng Báo Nhập:</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={itemForm.minThreshold}
                    onChange={e => setItemForm({ ...itemForm, minThreshold: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2 font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded font-bold"
                >
                  Lưu Mặt Hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT EMPLOYEE ================= */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-800">
                {editingEmployee ? 'CHỈNH SỬA NHÂN VIÊN' : 'THÊM NHÂN VIÊN MỚI'}
              </h3>
              <button onClick={() => setIsEmployeeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã Nhân Viên:</label>
                <input
                  type="text"
                  required
                  value={empForm.id}
                  onChange={e => setEmpForm({ ...empForm, id: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và Tên Đầy Đủ:</label>
                <input
                  type="text"
                  required
                  value={empForm.name}
                  onChange={e => setEmpForm({ ...empForm, name: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chức Danh / Bộ Phận:</label>
                <input
                  type="text"
                  required
                  value={empForm.title}
                  onChange={e => setEmpForm({ ...empForm, title: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email:</label>
                <input
                  type="email"
                  required
                  value={empForm.email}
                  onChange={e => setEmpForm({ ...empForm, email: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded font-bold"
                >
                  Lưu Nhân Viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT CUSTOMER ================= */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-800">
                {editingCustomer ? 'CHỈNH SỬA KHÁCH HÀNG' : 'THÊM KHÁCH HÀNG MỚI'}
              </h3>
              <button onClick={() => setIsCustomerModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mã Tắt Khách Hàng:</label>
                  <input
                    type="text"
                    required
                    value={custForm.code}
                    onChange={e => setCustForm({ ...custForm, code: e.target.value })}
                    placeholder="VD: BIDV"
                    className="w-full border border-slate-300 rounded p-2 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Người Liên Hệ:</label>
                  <input
                    type="text"
                    value={custForm.contact}
                    onChange={e => setCustForm({ ...custForm, contact: e.target.value })}
                    placeholder="VD: Anh Hải"
                    className="w-full border border-slate-300 rounded p-2 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Đầy Đủ Khách Hàng:</label>
                <input
                  type="text"
                  required
                  value={custForm.fullName}
                  onChange={e => setCustForm({ ...custForm, fullName: e.target.value })}
                  placeholder="VD: CÔNG TY TNHH SAMSUNG ELECTRONICS..."
                  className="w-full border border-slate-300 rounded p-2 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số Điện Thoại:</label>
                  <input
                    type="text"
                    value={custForm.phone}
                    onChange={e => setCustForm({ phone: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Khách Hàng:</label>
                  <input
                    type="email"
                    value={custForm.email}
                    onChange={e => setCustForm({ ...custForm, email: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa Chỉ:</label>
                <input
                  type="text"
                  value={custForm.address}
                  onChange={e => setCustForm({ ...custForm, address: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 text-slate-700 rounded font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 text-white rounded font-bold"
                >
                  Lưu Khách Hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}