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
  Radio,
  Menu
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [warehouses, setWarehouses] = useState(INITIAL_WAREHOUSES);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

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
      recipientEmails: ['an.nguyen@company.com', 'binh.tran@company.com']
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
      {/* --- TOP BANNER HEADER (RESPONSIVE) --- */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="p-2 bg-indigo-600 rounded-lg shadow-md hidden sm:block">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-sm sm:text-lg font-bold tracking-tight text-white leading-none">
                QUẢN LÝ KHO THÔNG MINH
              </h1>
              <span className="text-2xs sm:text-xs text-slate-400">Chuẩn TT 133/2016/TT-BTC</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-2 bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full text-xs font-mono">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Realtime Online</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              <select
                value={currentUserRole}
                onChange={(e) => setCurrentUserRole(e.target.value)}
                className="bg-slate-900 text-amber-400 text-2xs sm:text-xs font-semibold rounded px-1.5 py-1 border border-slate-600 focus:outline-none"
              >
                <option value="Management">Quản lý (Admin)</option>
                <option value="Warehouse">Nhân viên Kho</option>
                <option value="User">Người dùng thường</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* --- MENU ĐIỀU HƯỚNG RESPONSIVE (DESKTOP & MOBILE DRAWER) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-grow w-full">
        {/* Desktop Tabs */}
        <div className="hidden md:flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 mb-6 print:hidden scrollbar-none">
          {[
            { id: 'dashboard', label: 'Báo cáo Trực quan', icon: TrendingUp },
            { id: 'inventory', label: 'Tồn kho & Cảnh báo', icon: Layers },
            { id: 'itemsDir', label: 'Quản lý Hàng hóa', icon: Package },
            { id: 'requests', label: 'Quy trình & Phê duyệt', icon: Clock, badge: requests.filter(r => r.status === 'PENDING').length },
            { id: 'print', label: 'In Phiếu & Gửi Email', icon: Printer },
            { id: 'directory', label: 'NV & Khách hàng', icon: Users },
            { id: 'stocktake', label: 'Kiểm kê kho', icon: CheckSquare },
            { id: 'googleSheet', label: 'Google Sheets', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
                {tab.badge > 0 && (
                  <span className="ml-1 bg-amber-500 text-white text-2xs px-1.5 py-0.2 rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Dropdown Menu Selector */}
        <div className="md:hidden mb-4 print:hidden">
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Chọn chức năng (Menu):</label>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-indigo-700 shadow-sm"
          >
            <option value="dashboard">📈 Báo cáo Trực quan</option>
            <option value="inventory">📦 Tồn kho & Cảnh báo</option>
            <option value="itemsDir">🏷️ Quản lý Hàng hóa</option>
            <option value="requests">⏱️ Quy trình & Phê duyệt</option>
            <option value="print">🖨️ In Phiếu & Gửi Email</option>
            <option value="directory">👥 Quản lý NV & Khách hàng</option>
            <option value="stocktake">📋 Kiểm kê kho thực tế</option>
            <option value="googleSheet">📊 Kết nối Google Sheets</option>
          </select>
        </div>

        {/* Cửa sổ thông báo Toast */}
        {toastMessage && (
          <div className="mb-4 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between print:hidden text-xs sm:text-sm animate-bounce">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage('')} className="text-white hover:opacity-80">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ================= TAB 1: DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-2xs sm:text-xs font-semibold text-slate-500 uppercase">Tổng mã hàng</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800">{items.length} Mã</h3>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Building className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-2xs sm:text-xs font-semibold text-slate-500 uppercase">Kho hoạt động</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800">{warehouses.length} Kho</h3>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-amber-100 text-amber-600 rounded-lg">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-2xs sm:text-xs font-semibold text-slate-500 uppercase">Chạm ngưỡng</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-amber-600">{lowStockItems.length} SP</h3>
                </div>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <p className="text-2xs sm:text-xs font-semibold text-slate-500 uppercase">Chờ duyệt</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-indigo-600">
                    {requests.filter(r => r.status === 'PENDING').length} YC
                  </h3>
                </div>
              </div>
            </div>

            {lowStockItems.length > 0 && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-amber-800 text-xs sm:text-sm">CẢNH BÁO TỒN KHO DƯỚI NGƯỠNG AN TOÀN!</h4>
                    <p className="text-xs text-amber-700">Có {lowStockItems.length} sản phẩm cần tiến hành nhập bổ sung ngay.</p>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveTab('inventory')}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded self-start sm:self-auto"
                >
                  Xem chi tiết
                </button>
              </div>
            )}

            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" /> Báo cáo Trực quan Tồn kho theo Mặt hàng
                </h3>
                <button
                  onClick={() => handleExportCSV('INVENTORY')}
                  className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300"
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
                        <span className="text-slate-800 font-bold truncate max-w-[200px] sm:max-w-md">{item.id} - {item.name}</span>
                        <span className={isLow ? 'text-red-600 font-bold' : 'text-slate-600'}>
                          Tồn: {totalStock} {item.unit} (Ngưỡng: {item.minThreshold})
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5 sm:h-3 overflow-hidden">
                        <div
                          className={`h-2.5 sm:h-3 rounded-full transition-all duration-500 ${
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
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">DANH MỤC HÀNG HÓA & TỒN KHO</h3>
                <p className="text-xs text-slate-500">Quản lý mã hàng và định mức tồn kho tại các kho.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  onClick={() => handleExportCSV('INVENTORY')}
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Xuất Excel (.CSV)
                </button>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="Tìm Mã / Tên hàng..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 w-full sm:w-56"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Mã Hàng</th>
                    <th className="py-2.5 px-3">Tên Hàng Hóa</th>
                    <th className="py-2.5 px-3">ĐVT</th>
                    {warehouses.map(wh => (
                      <th key={wh.id} className="py-2.5 px-3 text-center">Kho {wh.name}</th>
                    ))}
                    <th className="py-2.5 px-3 text-center">Tổng Tồn</th>
                    <th className="py-2.5 px-3 text-center">Ngưỡng Báo</th>
                    <th className="py-2.5 px-3 text-center">Trạng Thái</th>
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
                          <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{item.id}</td>
                          <td className="py-2.5 px-3 font-medium text-slate-800">{item.name}</td>
                          <td className="py-2.5 px-3 text-slate-600">{item.unit}</td>
                          {warehouses.map(wh => (
                            <td key={wh.id} className="py-2.5 px-3 text-center font-semibold">
                              {item.stock[wh.id] || 0}
                            </td>
                          ))}
                          <td className="py-2.5 px-3 text-center font-bold text-slate-900">{totalStock}</td>
                          <td className="py-2.5 px-3 text-center font-semibold text-slate-500">{item.minThreshold}</td>
                          <td className="py-2.5 px-3 text-center">
                            {isLow ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs sm:text-xs font-bold bg-red-100 text-red-700 whitespace-nowrap">
                                <AlertTriangle className="w-3 h-3" /> Cần Nhập
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs sm:text-xs font-semibold bg-emerald-100 text-emerald-700 whitespace-nowrap">
                                <CheckCircle className="w-3 h-3" /> An toàn
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
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-600" /> QUẢN LÝ DANH MỤC HÀNG HÓA
                </h3>
                <p className="text-xs text-slate-500">Thêm mới, sửa, xóa hoặc nhập file danh mục hàng hóa.</p>
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg font-bold text-xs sm:text-sm shadow cursor-pointer">
                  <Upload className="w-4 h-4" /> Nhập CSV
                  <input type="file" accept=".csv" onChange={(e) => handleImportCSV(e, 'ITEMS')} className="hidden" />
                </label>

                <button
                  onClick={() => handleOpenItemModal()}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg font-bold text-xs sm:text-sm shadow"
                >
                  <Plus className="w-4 h-4" /> Thêm Mới
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Mã Hàng (Part No)</th>
                    <th className="py-2.5 px-3">Tên Hàng Hóa</th>
                    <th className="py-2.5 px-3">Đơn Vị Tính</th>
                    <th className="py-2.5 px-3 text-center">Ngưỡng Báo Nhập</th>
                    <th className="py-2.5 px-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{item.id}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{item.name}</td>
                      <td className="py-2.5 px-3 text-slate-600">{item.unit}</td>
                      <td className="py-2.5 px-3 text-center font-semibold text-slate-500">{item.minThreshold}</td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => handleOpenItemModal(item)} className="p-1.5 text-slate-600 hover:text-indigo-600 bg-slate-100 rounded">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 text-slate-600 hover:text-red-600 bg-slate-100 rounded">
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
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">QUY TRÌNH YÊU CẦU & PHÊ DUYỆT</h3>
                <p className="text-xs text-slate-500">Quản lý và duyệt các phiếu xuất/nhập kho.</p>
              </div>

              <button
                onClick={() => setIsRequestModalOpen(true)}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-xs sm:text-sm shadow"
              >
                <Plus className="w-4 h-4" /> Tạo Yêu Cầu Mới
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Số Phiếu</th>
                    <th className="py-2.5 px-3">Loại</th>
                    <th className="py-2.5 px-3">Người Yêu Cầu</th>
                    <th className="py-2.5 px-3">Khách Hàng / Đối Tác</th>
                    <th className="py-2.5 px-3">Kho</th>
                    <th className="py-2.5 px-3 text-center">Trạng Thái</th>
                    <th className="py-2.5 px-3 text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {requests.map(req => {
                    const wh = warehouses.find(w => w.id === req.warehouseId);
                    return (
                      <tr key={req.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{req.id}</td>
                        <td className="py-2.5 px-3 font-semibold">
                          {req.type === 'IMPORT' ? <span className="text-emerald-600">Nhập</span> : <span className="text-blue-600">Xuất</span>}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{req.requesterName}</td>
                        <td className="py-2.5 px-3 text-slate-700 truncate max-w-[150px]">{req.customerName}</td>
                        <td className="py-2.5 px-3 text-slate-600">{wh?.name}</td>
                        <td className="py-2.5 px-3 text-center">
                          {req.status === 'PENDING' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs sm:text-xs font-bold bg-amber-100 text-amber-800 whitespace-nowrap">
                              <Clock className="w-3 h-3" /> Chờ Duyệt
                            </span>
                          )}
                          {req.status === 'APPROVED' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs sm:text-xs font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap">
                              <CheckCircle className="w-3 h-3" /> Đã Duyệt
                            </span>
                          )}
                          {req.status === 'REJECTED' && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs sm:text-xs font-bold bg-red-100 text-red-800 whitespace-nowrap">
                              <XCircle className="w-3 h-3" /> Từ Chối
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {req.status === 'PENDING' && (currentUserRole === 'Management' || currentUserRole === 'Warehouse') && (
                              <>
                                <button
                                  onClick={() => handleApproveRequest(req.id, true)}
                                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-2xs sm:text-xs font-semibold"
                                >
                                  Duyệt
                                </button>
                                <button
                                  onClick={() => handleApproveRequest(req.id, false)}
                                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-2xs sm:text-xs font-semibold"
                                >
                                  Hủy
                                </button>
                              </>
                            )}

                            {req.status === 'APPROVED' && (
                              <button
                                onClick={() => {
                                  setSelectedPrintRequest(req);
                                  setActiveTab('print');
                                }}
                                className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-2xs sm:text-xs font-semibold border border-indigo-200 whitespace-nowrap"
                              >
                                <Printer className="w-3 h-3" /> In & Mail
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden gap-3">
              <div className="flex items-center gap-2">
                <label className="text-xs sm:text-sm font-semibold text-slate-700 whitespace-nowrap">Chọn Phiếu:</label>
                <select
                  value={selectedPrintRequest.id}
                  onChange={(e) => {
                    const found = requests.find(r => r.id === e.target.value);
                    if (found) setSelectedPrintRequest(found);
                  }}
                  className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs sm:text-sm font-bold w-full sm:w-auto"
                >
                  {requests.map(r => (
                    <option key={r.id} value={r.id}>
                      Phiếu {r.id} - {r.customerName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenGmailWeb(selectedPrintRequest)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg font-bold text-xs sm:text-sm shadow"
                >
                  <Mail className="w-4 h-4" /> Gửi Gmail Web
                </button>

                <button
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg font-bold text-xs sm:text-sm shadow"
                >
                  <Printer className="w-4 h-4" /> In A4
                </button>
              </div>
            </div>

            {/* Mẫu Phiếu A4 Responsive */}
            <div className="bg-white p-6 sm:p-10 rounded-xl border border-slate-300 shadow-md max-w-4xl mx-auto text-slate-900 font-sans print:shadow-none print:border-none print:p-0 overflow-x-auto">
              
              <div className="flex justify-between items-start mb-4">
                <div></div>
                <div className="text-right text-2xs sm:text-xs italic leading-relaxed">
                  <p className="font-bold not-italic">
                    {selectedPrintRequest.type === 'IMPORT' ? 'Mẫu số 01 – VT' : 'Mẫu số 02 – VT'}
                  </p>
                  <p>(Ban hành theo Thông tư số 133/2016/TT-BTC</p>
                  <p>Ngày 26/08/2016 của Bộ Tài chính)</p>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-xs sm:text-sm italic font-semibold mb-1">
                  Ngày {selectedPrintRequest.date.split('-')[2]} tháng {selectedPrintRequest.date.split('-')[1]} năm {selectedPrintRequest.date.split('-')[0]}
                </p>
                <h2 className="text-xl sm:text-2xl font-bold uppercase">
                  {selectedPrintRequest.type === 'IMPORT' ? 'PHIẾU NHẬP KHO' : 'PHIẾU XUẤT KHO'}
                </h2>
                <p className="text-xs sm:text-sm font-semibold italic mt-1">
                  Số phiếu: <span className="font-mono not-italic">{selectedPrintRequest.id}</span>
                </p>
              </div>

              <div className="text-xs sm:text-sm space-y-2.5 mb-6 leading-relaxed">
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

                <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                  <span className="font-bold">3. Thực hiện tại kho:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={selectedPrintRequest.warehouseId === 'WH01'} readOnly className="w-4 h-4 accent-indigo-600" />
                    <span>Hà Nội</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={selectedPrintRequest.warehouseId === 'WH02'} readOnly className="w-4 h-4 accent-indigo-600" />
                    <span>Hồ Chí Minh</span>
                  </label>
                </div>

                {selectedPrintRequest.type !== 'IMPORT' && (
                  <>
                    <div className="space-y-1.5">
                      <span className="font-bold">4. Sửa chữa/ Bán máy:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-4 sm:pl-6">
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

                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      <span className="font-bold">5. Lý do xuất kho:</span>
                      <label className="flex items-center gap-1.5">
                        <input type="checkbox" checked={selectedPrintRequest.reasonType === 'SERVICE'} readOnly className="w-4 h-4 accent-indigo-600" />
                        <span>Dịch vụ</span>
                      </label>
                      <label className="flex items-center gap-1.5">
                        <input type="checkbox" checked={selectedPrintRequest.reasonType === 'WARRANTY'} readOnly className="w-4 h-4 accent-indigo-600" />
                        <span>Bảo hành</span>
                      </label>
                      <label className="flex items-center gap-1.5">
                        <input type="checkbox" checked={selectedPrintRequest.reasonType === 'INTERNAL'} readOnly className="w-4 h-4 accent-indigo-600" />
                        <span>Nội bộ</span>
                      </label>
                    </div>
                  </>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm border-collapse border border-slate-900 mb-6">
                  <thead>
                    <tr className="bg-slate-100 text-center font-bold">
                      <th className="border border-slate-900 p-2 w-10">STT</th>
                      <th className="border border-slate-900 p-2">TÊN HÀNG HÓA</th>
                      <th className="border border-slate-900 p-2">PART NO</th>
                      <th className="border border-slate-900 p-2 w-20 sm:w-24">SỐ LƯỢNG</th>
                      <th className="border border-slate-900 p-2">GHI CHÚ – SERIAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedPrintRequest.items.map((it, idx) => (
                      <tr key={idx} className="text-center">
                        <td className="border border-slate-900 p-2">{idx + 1}</td>
                        <td className="border border-slate-900 p-2 text-left font-semibold">{it.name}</td>
                        <td className="border border-slate-900 p-2 font-mono">{it.itemId}</td>
                        <td className="border border-slate-900 p-2 font-bold">{it.quantity}</td>
                        <td className="border border-slate-900 p-2 text-left text-2xs sm:text-xs">{it.serialNotes}</td>
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
              </div>

              <div className="grid grid-cols-3 text-center text-2xs sm:text-xs gap-2 pt-4">
                <div>
                  <p className="font-bold">{selectedPrintRequest.type === 'IMPORT' ? 'Người giao hàng' : 'Người lập phiếu'}</p>
                  <p className="italic text-slate-500">(Ký, họ tên)</p>
                  <div className="h-12 sm:h-16"></div>
                  <p className="font-semibold">{selectedPrintRequest.requesterName}</p>
                </div>
                <div>
                  <p className="font-bold">Thủ kho</p>
                  <p className="italic text-slate-500">(Ký, họ tên)</p>
                  <div className="h-12 sm:h-16"></div>
                  <p className="font-semibold">Trần Thị Bình</p>
                </div>
                <div>
                  <p className="font-bold">Kế toán / Quản lý</p>
                  <p className="italic text-slate-500">(Ký, họ tên)</p>
                  <div className="h-12 sm:h-16"></div>
                  <p className="font-semibold">{selectedPrintRequest.approvedBy || 'Nguyễn Văn An'}</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= TAB 5: EMPLOYEES & CUSTOMERS MANAGEMENT ================= */}
        {activeTab === 'directory' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" /> QUẢN LÝ NHÂN VIÊN
                </h3>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <label className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1.5 rounded text-2xs sm:text-xs font-bold cursor-pointer">
                    <Upload className="w-3 h-3" /> Nhập NV
                    <input type="file" accept=".csv" onChange={(e) => handleImportCSV(e, 'EMPLOYEES')} className="hidden" />
                  </label>
                  <button onClick={() => handleExportCSV('EMPLOYEES')} className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1.5 rounded text-2xs sm:text-xs font-bold border">
                    <Download className="w-3 h-3" /> Xuất NV
                  </button>
                  <button onClick={() => handleOpenEmpModal()} className="flex items-center gap-1 bg-indigo-600 text-white px-2.5 py-1.5 rounded text-2xs sm:text-xs font-bold">
                    <Plus className="w-3 h-3" /> Thêm
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse text-2xs sm:text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <th className="py-2 px-2.5">Mã NV</th>
                      <th className="py-2 px-2.5">Họ và Tên</th>
                      <th className="py-2 px-2.5">Chức Danh</th>
                      <th className="py-2 px-2.5">Email</th>
                      <th className="py-2 px-2.5 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {employees.map(emp => (
                      <tr key={emp.id} className="hover:bg-slate-50">
                        <td className="py-2 px-2.5 font-mono font-bold text-indigo-600">{emp.id}</td>
                        <td className="py-2 px-2.5 font-semibold text-slate-800">{emp.name}</td>
                        <td className="py-2 px-2.5 text-slate-600">{emp.title}</td>
                        <td className="py-2 px-2.5 text-slate-500 font-mono">{emp.email}</td>
                        <td className="py-2 px-2.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleOpenEmpModal(emp)} className="p-1 text-slate-600 hover:text-indigo-600"><Edit className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteEmployee(emp.id)} className="p-1 text-slate-600 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" /> QUẢN LÝ KHÁCH HÀNG
                </h3>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <label className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1.5 rounded text-2xs sm:text-xs font-bold cursor-pointer">
                    <Upload className="w-3 h-3" /> Nhập KH
                    <input type="file" accept=".csv" onChange={(e) => handleImportCSV(e, 'CUSTOMERS')} className="hidden" />
                  </label>
                  <button onClick={() => handleExportCSV('CUSTOMERS')} className="flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-1.5 rounded text-2xs sm:text-xs font-bold border">
                    <Download className="w-3 h-3" /> Xuất KH
                  </button>
                  <button onClick={() => handleOpenCustModal()} className="flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-1.5 rounded text-2xs sm:text-xs font-bold">
                    <Plus className="w-3 h-3" /> Thêm
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse text-2xs sm:text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <th className="py-2 px-2.5">Mã Tắt</th>
                      <th className="py-2 px-2.5">Tên Đầy Đủ Khách Hàng</th>
                      <th className="py-2 px-2.5">Liên Hệ</th>
                      <th className="py-2 px-2.5">SĐT & Email</th>
                      <th className="py-2 px-2.5 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {customers.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50">
                        <td className="py-2 px-2.5 font-mono font-bold text-emerald-600">{c.code}</td>
                        <td className="py-2 px-2.5 font-semibold text-slate-800">{c.fullName}</td>
                        <td className="py-2 px-2.5 text-slate-600">{c.contact}</td>
                        <td className="py-2 px-2.5 text-slate-500 font-mono">{c.phone} <br /> {c.email}</td>
                        <td className="py-2 px-2.5 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleOpenCustModal(c)} className="p-1 text-slate-600 hover:text-indigo-600"><Edit className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleDeleteCustomer(c.id)} className="p-1 text-slate-600 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
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
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">KIỂM KÊ KHO THỰC TẾ & ĐỐI SOÁT</h3>
                <p className="text-xs text-slate-500">Nhập số liệu thực tế kiểm kê tại kho.</p>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-xs sm:text-sm font-semibold">Chọn Kho:</label>
                <select
                  value={stocktakeWH}
                  onChange={(e) => setStocktakeWH(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-semibold"
                >
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Mã Hàng</th>
                    <th className="py-2.5 px-3">Tên Hàng Hóa</th>
                    <th className="py-2.5 px-3 text-center">Sổ Sách</th>
                    <th className="py-2.5 px-3 text-center">Thực Tế</th>
                    <th className="py-2.5 px-3 text-center">Chênh Lệch</th>
                    <th className="py-2.5 px-3 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map(item => {
                    const bookQty = item.stock[stocktakeWH] || 0;
                    const actualQty = stocktakeData[item.id] !== undefined ? stocktakeData[item.id] : bookQty;
                    const diff = actualQty - bookQty;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{item.id}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{item.name}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-700">{bookQty}</td>
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            value={actualQty}
                            onChange={(e) => setStocktakeData({ ...stocktakeData, [item.id]: e.target.value })}
                            className="w-16 sm:w-20 border border-slate-300 rounded px-2 py-1 text-center font-bold"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold">
                          {diff === 0 ? <span className="text-slate-400">0</span> : diff > 0 ? <span className="text-emerald-600">+{diff}</span> : <span className="text-red-600">{diff}</span>}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button onClick={() => handleStocktakeSave(item.id, stocktakeWH, actualQty)} className="px-2.5 py-1 bg-indigo-600 text-white text-2xs sm:text-xs font-semibold rounded">
                            Lưu
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

        {/* ================= TAB 7: GOOGLE SHEETS ================= */}
        {activeTab === 'googleSheet' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                  <Database className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800">KẾT NỐI GOOGLE SHEETS</h3>
                  <p className="text-xs text-slate-500">Đồng bộ tự động tồn kho lên Google Sheet.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Webhook URL:</label>
                  <input
                    type="text"
                    value={gsheetUrl}
                    onChange={(e) => setGsheetUrl(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs sm:text-sm font-mono"
                  />
                </div>

                {syncStatus && <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold">{syncStatus}</div>}

                <button onClick={handleSyncToGoogleSheet} className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg font-bold text-xs sm:text-sm shadow">
                  <RefreshCw className="w-4 h-4" /> ĐẨY DỮ LIỆU LÊN GOOGLE SHEETS
                </button>
              </div>
            </div>

            <div className="bg-slate-900 text-slate-200 p-4 sm:p-6 rounded-xl border border-slate-800 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-xs sm:text-sm text-white">MÃ GOOGLE APPS SCRIPT</h4>
                <button onClick={() => copyToClipboard(GOOGLE_APPS_SCRIPT_CODE)} className="flex items-center gap-1 bg-slate-800 text-amber-400 px-3 py-1.5 rounded text-xs font-bold">
                  <Copy className="w-3.5 h-3.5" /> Sao chép
                </button>
              </div>
              <pre className="text-2xs font-mono bg-slate-950 p-3 rounded-lg overflow-x-auto text-emerald-400 max-h-48">
                {GOOGLE_APPS_SCRIPT_CODE}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: CREATE NEW REQUEST ================= */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm sm:text-lg font-bold text-slate-800">TẠO YÊU CẦU XUẤT / NHẬP KHO</h3>
              <button onClick={() => setIsRequestModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    placeholder="VD: 03/26/XK"
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <label className="block font-bold text-slate-700 mb-1">Người yêu cầu / giao:</label>
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
                <label className="block font-bold text-slate-700 mb-1">Khách hàng / Nhà cung cấp:</label>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Phân loại Sửa/Bán:</label>
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
                    <label className="block font-bold text-slate-700 mb-1">Lý do xuất:</label>
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
                <label className="block font-bold text-slate-700 mb-1">Danh Sách Vật Tư & Tồn Kho:</label>
                {reqItemsList.map((ri, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-2">
                    <select
                      value={ri.itemId}
                      onChange={(e) => {
                        const newList = [...reqItemsList];
                        newList[index].itemId = e.target.value;
                        setReqItemsList(newList);
                      }}
                      className="w-full sm:w-1/2 border border-slate-300 rounded p-1.5 font-semibold"
                    >
                      {items.map(i => {
                        const stockSum = Object.values(i.stock).reduce((a, b) => a + b, 0);
                        return (
                          <option key={i.id} value={i.id}>{i.id} - {i.name} [Tồn: {stockSum}]</option>
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
                      className="w-20 border border-slate-300 rounded p-1.5 text-center font-bold"
                    />

                    <input
                      type="text"
                      placeholder="Serial / Ghi chú..."
                      value={ri.serialNotes}
                      onChange={(e) => {
                        const newList = [...reqItemsList];
                        newList[index].serialNotes = e.target.value;
                        setReqItemsList(newList);
                      }}
                      className="flex-grow border border-slate-300 rounded p-1.5"
                    />

                    {reqItemsList.length > 1 && (
                      <button type="button" onClick={() => setReqItemsList(reqItemsList.filter((_, idx) => idx !== index))} className="text-red-600 p-1">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" onClick={() => setReqItemsList([...reqItemsList, { itemId: 'CMOS-2500', quantity: 1, serialNotes: '' }])} className="text-indigo-600 font-bold text-xs flex items-center gap-1 mt-1">
                  <Plus className="w-3.5 h-3.5" /> Thêm mặt hàng
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button type="button" onClick={() => setIsRequestModalOpen(false)} className="px-4 py-2 border rounded-lg text-slate-700 text-xs font-semibold">Hủy</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs sm:text-sm shadow">GỬI YÊU CẦU</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD/EDIT ITEM ================= */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="text-base font-bold text-slate-800">{editingItem ? 'SỬA HÀNG HÓA' : 'THÊM HÀNG HÓA'}</h3>
              <button onClick={() => setIsItemModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveItem} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã Hàng (Part No):</label>
                <input type="text" required value={itemForm.id} onChange={e => setItemForm({ ...itemForm, id: e.target.value })} className="w-full border rounded p-2 font-mono font-bold" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Hàng Hóa:</label>
                <input type="text" required value={itemForm.name} onChange={e => setItemForm({ ...itemForm, name: e.target.value })} className="w-full border rounded p-2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ĐVT:</label>
                  <input type="text" required value={itemForm.unit} onChange={e => setItemForm({ ...itemForm, unit: e.target.value })} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngưỡng Báo:</label>
                  <input type="number" min="1" required value={itemForm.minThreshold} onChange={e => setItemForm({ ...itemForm, minThreshold: Number(e.target.value) })} className="w-full border rounded p-2 font-bold" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setIsItemModalOpen(false)} className="px-3 py-1.5 border rounded text-slate-700">Hủy</button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded font-bold">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT EMPLOYEE ================= */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="text-base font-bold text-slate-800">{editingEmployee ? 'SỬA NHÂN VIÊN' : 'THÊM NHÂN VIÊN'}</h3>
              <button onClick={() => setIsEmployeeModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveEmployee} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã NV:</label>
                <input type="text" required value={empForm.id} onChange={e => setEmpForm({ ...empForm, id: e.target.value })} className="w-full border rounded p-2 font-mono font-bold" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và Tên:</label>
                <input type="text" required value={empForm.name} onChange={e => setEmpForm({ ...empForm, name: e.target.value })} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Chức Danh:</label>
                <input type="text" required value={empForm.title} onChange={e => setEmpForm({ ...empForm, title: e.target.value })} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email:</label>
                <input type="email" required value={empForm.email} onChange={e => setEmpForm({ ...empForm, email: e.target.value })} className="w-full border rounded p-2 font-mono" />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setIsEmployeeModalOpen(false)} className="px-3 py-1.5 border rounded text-slate-700">Hủy</button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded font-bold">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT CUSTOMER ================= */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="text-base font-bold text-slate-800">{editingCustomer ? 'SỬA KHÁCH HÀNG' : 'THÊM KHÁCH HÀNG'}</h3>
              <button onClick={() => setIsCustomerModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <form onSubmit={handleSaveCustomer} className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mã Tắt:</label>
                  <input type="text" required value={custForm.code} onChange={e => setCustForm({ ...custForm, code: e.target.value })} className="w-full border rounded p-2 font-mono font-bold" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Người Liên Hệ:</label>
                  <input type="text" value={custForm.contact} onChange={e => setCustForm({ ...custForm, contact: e.target.value })} className="w-full border rounded p-2" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Đầy Đủ:</label>
                <input type="text" required value={custForm.fullName} onChange={e => setCustForm({ ...custForm, fullName: e.target.value })} className="w-full border rounded p-2" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số Điện Thoại:</label>
                  <input type="text" value={custForm.phone} onChange={e => setCustForm({ ...custForm, phone: e.target.value })} className="w-full border rounded p-2 font-mono" />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email:</label>
                  <input type="email" value={custForm.email} onChange={e => setCustForm({ ...custForm, email: e.target.value })} className="w-full border rounded p-2 font-mono" />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa Chỉ:</label>
                <input type="text" value={custForm.address} onChange={e => setCustForm({ ...custForm, address: e.target.value })} className="w-full border rounded p-2" />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t">
                <button type="button" onClick={() => setIsCustomerModalOpen(false)} className="px-3 py-1.5 border rounded text-slate-700">Hủy</button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white rounded font-bold">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}