import React, { useState, useMemo, useEffect } from 'react';
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
  Shield, 
  Building, 
  CheckSquare, 
  Layers, 
  X, 
  Edit, 
  Trash2, 
  Download, 
  Upload, 
  Radio, 
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Filter,
  BarChart2,
  Calendar
} from 'lucide-react';

// --- INITIAL MOCK DATA ---
const INITIAL_WAREHOUSES = [
  { id: 'WH01', name: 'Hà Nội', location: 'Cầu Giấy, Hà Nội' },
  { id: 'WH02', name: 'Hồ Chí Minh', location: 'Quận 9, TP. HCM' },
];

const INITIAL_EMPLOYEES = [
  { id: 'NV001', name: 'Nguyễn Trần Cường', title: 'Nhân viên Kỹ thuật', email: 'cuongnt@honghatst.vn', role: 'User' },
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
  { id: 'DX8000', name: 'DX8000', partNo: 'PWT52012424A', unit: 'Bộ', minThreshold: 5, stock: { WH01: 50, WH02: 10 } },
  { id: 'MH001', name: 'Máy tính xách tay Dell XPS 15', unit: 'Bộ', minThreshold: 5, stock: { WH01: 8, WH02: 3 } },
  { id: 'MH002', name: 'Màn hình Dell UltraSharp 27"', unit: 'Cái', minThreshold: 10, stock: { WH01: 4, WH02: 12 } },
  { id: 'MH003', name: 'Bàn phím Cơ Logitech MX Keys', unit: 'Cái', minThreshold: 15, stock: { WH01: 25, WH02: 8 } },
  { id: 'MH004', name: 'Chuột Không Dây Logitech MX Master 3S', unit: 'Cái', minThreshold: 12, stock: { WH01: 3, WH02: 15 } },
];

const INITIAL_REQUESTS = [
  {
    id: '01/26/XK',
    type: 'EXPORT',
    requesterName: 'Phan Thị Khánh Phương',
    customerName: 'BIDV CN Thành Công',
    warehouseId: 'WH01',
    destWarehouseId: '',
    workType: 'REPAIR_SINGLE',
    reasonType: 'INTERNAL',
    date: '2026-08-03',
    status: 'APPROVED',
    approvedBy: 'Nguyễn Văn An',
    contractNo: '',
    paymentAmount: '',
    paymentDate: '',
    items: [
      { itemId: 'DX8000', name: 'DX8000', partNo: 'PWT52012424A', quantity: 50, serialNotes: 'Cài Agribank' }
    ],
    note: 'Xuất linh kiện nội bộ',
    recipientEmails: ['phuongptk@company.com']
  },
  {
    id: '02/26/NK',
    type: 'IMPORT',
    requesterName: 'Trần Thị Bình',
    customerName: 'Công ty Cổ phần FPT',
    warehouseId: 'WH01',
    destWarehouseId: '',
    workType: 'STOCK_IN',
    reasonType: '',
    date: '2026-08-06',
    status: 'APPROVED',
    approvedBy: 'Nguyễn Văn An',
    contractNo: '',
    paymentAmount: '',
    paymentDate: '',
    items: [
      { itemId: 'MH001', name: 'Máy tính xách tay Dell XPS 15', partNo: 'DELL-XPS15', quantity: 10, serialNotes: 'Lô hàng mới nhập' },
      { itemId: 'CMOS-2500', name: 'Pin CMOS máy Move2500', partNo: 'CMOS-M25', quantity: 20, serialNotes: 'Lô hàng nhập kho' }
    ],
    note: 'Nhập hàng mới từ nhà cung cấp FPT',
    recipientEmails: ['binh.tran@company.com']
  },
  {
    id: '03/26/CK',
    type: 'TRANSFER',
    requesterName: 'Nguyễn Trần Cường',
    customerName: 'Điều chuyển Nội bộ',
    warehouseId: 'WH01',
    destWarehouseId: 'WH02',
    workType: 'INTERNAL_TRANSFER',
    reasonType: 'INTERNAL',
    date: '2026-08-07',
    status: 'APPROVED',
    approvedBy: 'Nguyễn Văn An',
    contractNo: 'Lên Kế hoạch Luân chuyển',
    paymentAmount: '',
    paymentDate: '',
    items: [
      { itemId: 'MH003', name: 'Bàn phím Cơ Logitech MX Keys', partNo: 'LOGI-MX-KEY', quantity: 5, serialNotes: 'Chuyển hỗ trợ kho HCM' }
    ],
    note: 'Điều chuyển bàn phím từ Kho Hà Nội vào Kho Hồ Chí Minh',
    recipientEmails: ['cuongnt@honghatst.vn']
  }
];

export default function App() {
  // Nạp tự động Tailwind CSS CDN khi khởi chạy để tránh lỗi vỡ giao diện trên Vercel
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
  const [warehouses] = useState(INITIAL_WAREHOUSES);
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const [selectedPrintRequest, setSelectedPrintRequest] = useState(INITIAL_REQUESTS[0]);

  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [requestFilterType, setRequestFilterType] = useState('ALL');
  const [reportWarehouseFilter, setReportWarehouseFilter] = useState('ALL');

  // Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [newRequestType, setNewRequestType] = useState('EXPORT'); // EXPORT, IMPORT, TRANSFER
  const [customVoucherId, setCustomVoucherId] = useState('');
  const [reqRequesterName, setReqRequesterName] = useState('Phan Thị Khánh Phương');
  const [reqCustomerName, setReqCustomerName] = useState('');
  const [reqWarehouse, setReqWarehouse] = useState('WH01'); // Kho nguồn / Kho chính
  const [reqDestWarehouse, setReqDestWarehouse] = useState('WH02'); // Kho đích khi chuyển kho
  const [reqWorkType, setReqWorkType] = useState('REPAIR_SINGLE');
  const [reqReasonType, setReqReasonType] = useState('INTERNAL');
  const [reqContractNo, setReqContractNo] = useState('');
  const [reqPaymentAmount, setReqPaymentAmount] = useState('');
  const [reqPaymentDate, setReqPaymentDate] = useState('');
  const [reqNote, setReqNote] = useState('');
  const [reqItemsList, setReqItemsList] = useState([{ itemId: 'DX8000', quantity: 50, serialNotes: 'Cài Agribank' }]);

  // Item Modal State
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemForm, setItemForm] = useState({ id: '', name: '', partNo: '', unit: 'Cái', minThreshold: 10 });

  // Employee Modal State
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [empForm, setEmpForm] = useState({ id: '', name: '', title: '', email: '', role: 'User' });

  // Customer Modal State
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [custForm, setCustForm] = useState({ id: '', code: '', fullName: '', contact: '', phone: '', email: '', address: '' });

  // Stocktake State
  const [stocktakeWH, setStocktakeWH] = useState('WH01');
  const [stocktakeInputs, setStocktakeInputs] = useState({});

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

  // --- TÍNH TOÁN BÁO CÁO XUẤT NHẬP TỒN CHI TIẾT ---
  const movementReport = useMemo(() => {
    const approvedReqs = requests.filter(r => 
      r.status === 'APPROVED' && 
      (reportWarehouseFilter === 'ALL' || r.warehouseId === reportWarehouseFilter || r.destWarehouseId === reportWarehouseFilter)
    );

    let grandTotalImportQty = 0;
    let grandTotalExportQty = 0;

    const itemReportList = items.map(item => {
      let totalImport = 0;
      let totalExport = 0;

      approvedReqs.forEach(req => {
        const found = req.items.find(it => it.itemId === item.id);
        if (found) {
          const qty = Number(found.quantity) || 0;

          if (req.type === 'IMPORT') {
            if (reportWarehouseFilter === 'ALL' || req.warehouseId === reportWarehouseFilter) {
              totalImport += qty;
            }
          } else if (req.type === 'EXPORT') {
            if (reportWarehouseFilter === 'ALL' || req.warehouseId === reportWarehouseFilter) {
              totalExport += qty;
            }
          } else if (req.type === 'TRANSFER') {
            if (reportWarehouseFilter === 'ALL') {
              // Nhìn tổng thể không làm thay đổi tổng tồn kho hệ thống
            } else {
              if (req.warehouseId === reportWarehouseFilter) {
                totalExport += qty; // Kho nguồn xuất đi
              }
              if (req.destWarehouseId === reportWarehouseFilter) {
                totalImport += qty; // Kho đích nhận về
              }
            }
          }
        }
      });

      grandTotalImportQty += totalImport;
      grandTotalExportQty += totalExport;

      const currentStock = reportWarehouseFilter === 'ALL' 
        ? Object.values(item.stock).reduce((a, b) => a + b, 0)
        : (item.stock[reportWarehouseFilter] || 0);

      return {
        ...item,
        totalImport,
        totalExport,
        currentStock
      };
    });

    return {
      items: itemReportList,
      totalImportQty: grandTotalImportQty,
      totalExportQty: grandTotalExportQty,
      totalApprovedCount: approvedReqs.length
    };
  }, [items, requests, reportWarehouseFilter]);

  // --- XUẤT EXCEL / CSV ---
  const handleExportCSV = (dataType) => {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    
    if (dataType === 'INVENTORY') {
      csvContent += "Mã Hàng,Tên Hàng Hóa,Part No,Đơn Vị,Kho Hà Nội,Kho HCM,Tổng Tồn,Ngưỡng An Toàn\n";
      items.forEach(i => {
        const total = Object.values(i.stock).reduce((a, b) => a + b, 0);
        csvContent += `"${i.id}","${i.name}","${i.partNo || ''}","${i.unit}",${i.stock.WH01 || 0},${i.stock.WH02 || 0},${total},${i.minThreshold}\n`;
      });
    } else if (dataType === 'IMPORT_EXPORT_REPORT') {
      csvContent += "Mã Hàng,Tên Hàng Hóa,Đơn Vị Tính,Tổng SL Nhập,Tổng SL Xuất,Tồn Kho Hiện Tại,Ngưỡng An Toàn\n";
      movementReport.items.forEach(r => {
        csvContent += `"${r.id}","${r.name}","${r.unit}",${r.totalImport},${r.totalExport},${r.currentStock},${r.minThreshold}\n`;
      });
    } else if (dataType === 'REQUESTS') {
      csvContent += "Mã Phiếu,Loại Phiếu,Ngày Tạo,Người Yêu Cầu,Đối Tác / Kho Đích,Kho Nguồn,Trạng Thái,Người Duyệt,Sản Phẩm & Số Lượng,Ghi Chú\n";
      requests.forEach(r => {
        const itemsStr = r.items.map(it => `${it.name || it.itemId} (SL: ${it.quantity})`).join('; ');
        const typeLabel = r.type === 'IMPORT' ? 'Nhập kho' : r.type === 'TRANSFER' ? 'Chuyển kho' : 'Xuất kho';
        const partnerLabel = r.type === 'TRANSFER' ? `Kho đích: ${r.destWarehouseId === 'WH01' ? 'Hà Nội' : 'HCM'}` : r.customerName;
        const statusLabel = r.status === 'APPROVED' ? 'Đã duyệt' : r.status === 'REJECTED' ? 'Từ chối' : 'Chờ duyệt';
        csvContent += `"${r.id}","${typeLabel}","${r.date}","${r.requesterName}","${partnerLabel || ''}","${r.warehouseId}","${statusLabel}","${r.approvedBy || ''}","${itemsStr}","${r.note || ''}"\n`;
      });
    } else if (dataType === 'EMPLOYEES') {
      csvContent += "Mã NV,Họ và Tên,Chức Danh,Email,Vai Trò\n";
      employees.forEach(e => {
        csvContent += `"${e.id}","${e.name}","${e.title}","${e.email}","${e.role}"\n`;
      });
    } else if (dataType === 'CUSTOMERS') {
      csvContent += "Mã Tắt,Tên Đầy Đủ,Người Liên Hệ,Số Điện Thoại,Email,Địa Chỉ\n";
      customers.forEach(c => {
        csvContent += `"${c.code}","${c.fullName}","${c.contact}","${c.phone}","${c.email}","${c.address}"\n`;
      });
    } else if (dataType === 'STOCKTAKE') {
      const whName = stocktakeWH === 'WH01' ? 'Hà Nội' : 'Hồ Chí Minh';
      csvContent += `Mã Hàng,Tên Hàng Hóa,Tồn Máy Tính (${whName}),Tồn Thực Tế,Chênh Lệch\n`;
      items.forEach(i => {
        const currentStock = i.stock[stocktakeWH] || 0;
        const inputVal = stocktakeInputs[i.id] !== undefined ? stocktakeInputs[i.id] : currentStock;
        const diff = Number(inputVal) - currentStock;
        csvContent += `"${i.id}","${i.name}",${currentStock},${inputVal},${diff}\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const fileNameMap = {
      INVENTORY: 'Bao_Cao_Ton_Kho.csv',
      IMPORT_EXPORT_REPORT: 'Bao_Cao_Xuat_Nhap_Ton.csv',
      REQUESTS: 'Danh_Sach_Phieu_Nhap_Xuat.csv',
      EMPLOYEES: 'Danh_Sach_Nhan_Vien.csv',
      CUSTOMERS: 'Danh_Sach_Khach_Hang.csv',
      STOCKTAKE: `Bao_Cao_Kiem_Ke_Kho_${stocktakeWH}.csv`
    };
    link.setAttribute("download", fileNameMap[dataType] || `Du_Lieu_${dataType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Đã xuất file Excel dữ liệu ${dataType} thành công!`);
  };

  // --- NHẬP EXCEL / CSV ---
  const handleImportCSV = (e, dataType) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const rows = text.split('\n').map(row => row.split(',').map(cell => cell.replace(/^"|"$/g, '').trim()));
      
      if (dataType === 'ITEMS' && rows.length > 1) {
        const newItems = [...items];
        let addedCount = 0;
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (r.length >= 2 && r[0]) {
            const exists = newItems.find(item => item.id === r[0]);
            if (!exists) {
              newItems.push({
                id: r[0],
                name: r[1],
                partNo: r[2] || '',
                unit: r[3] || 'Cái',
                minThreshold: Number(r[7]) || Number(r[4]) || 10,
                stock: { 
                  WH01: Number(r[4]) || 0, 
                  WH02: Number(r[5]) || 0 
                }
              });
              addedCount++;
            }
          }
        }
        setItems(newItems);
        showToast(`Đã nhập thành công ${addedCount} mặt hàng từ file Excel!`);
      } else if (dataType === 'REQUESTS' && rows.length > 1) {
        const newReqs = [...requests];
        let addedReqCount = 0;
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (r.length >= 4 && r[0]) {
            const exists = newReqs.find(req => req.id === r[0]);
            if (!exists) {
              const typeStr = (r[1] || '').toUpperCase();
              let reqType = 'EXPORT';
              if (typeStr.includes('NHẬP') || typeStr.includes('IMPORT')) reqType = 'IMPORT';
              if (typeStr.includes('CHUYỂN') || typeStr.includes('TRANSFER')) reqType = 'TRANSFER';

              newReqs.unshift({
                id: r[0],
                type: reqType,
                date: r[2] || new Date().toISOString().split('T')[0],
                requesterName: r[3] || 'Nhân viên',
                customerName: r[4] || 'Đối tác',
                warehouseId: r[5] || 'WH01',
                destWarehouseId: reqType === 'TRANSFER' ? 'WH02' : '',
                workType: 'REPAIR_SINGLE',
                reasonType: 'INTERNAL',
                status: (r[6] || '').includes('duyệt') || r[6] === 'APPROVED' ? 'APPROVED' : 'PENDING',
                approvedBy: r[7] || '',
                items: [{ itemId: 'DX8000', name: r[8] || 'DX8000', partNo: 'PWT52012424A', quantity: 1, serialNotes: '' }],
                note: r[9] || 'Nhập từ file Excel',
                recipientEmails: ['cuongnt@honghatst.vn']
              });
              addedReqCount++;
            }
          }
        }
        setRequests(newReqs);
        showToast(`Đã nhập thành công ${addedReqCount} phiếu Nhập/Xuất kho từ file Excel!`);
      } else if (dataType === 'EMPLOYEES' && rows.length > 1) {
        const newEmps = [...employees];
        let addedCount = 0;
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (r.length >= 2 && r[0]) {
            const exists = newEmps.find(emp => emp.id === r[0]);
            if (!exists) {
              newEmps.push({ 
                id: r[0], 
                name: r[1] || '', 
                title: r[2] || '', 
                email: r[3] || '', 
                role: r[4] || 'User' 
              });
              addedCount++;
            }
          }
        }
        setEmployees(newEmps);
        showToast(`Đã nhập thành công ${addedCount} nhân viên từ file Excel!`);
      } else if (dataType === 'CUSTOMERS' && rows.length > 1) {
        const newCusts = [...customers];
        let addedCount = 0;
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (r.length >= 2 && r[0]) {
            const exists = newCusts.find(c => c.code === r[0]);
            if (!exists) {
              newCusts.push({ 
                id: `KH00${newCusts.length + 1}`, 
                code: r[0], 
                fullName: r[1] || r[0], 
                contact: r[2] || '', 
                phone: r[3] || '', 
                email: r[4] || '', 
                address: r[5] || '' 
              });
              addedCount++;
            }
          }
        }
        setCustomers(newCusts);
        showToast(`Đã nhập thành công ${addedCount} khách hàng từ file Excel!`);
      } else if (dataType === 'STOCKTAKE' && rows.length > 1) {
        const newInputs = { ...stocktakeInputs };
        let updatedCount = 0;
        for (let i = 1; i < rows.length; i++) {
          const r = rows[i];
          if (r.length >= 2 && r[0]) {
            const itemId = r[0];
            const actualQty = r[3] !== undefined && r[3] !== '' ? Number(r[3]) : Number(r[2]);
            if (!isNaN(actualQty)) {
              newInputs[itemId] = actualQty;
              updatedCount++;
            }
          }
        }
        setStocktakeInputs(newInputs);
        showToast(`Đã nhập số lượng kiểm kê cho ${updatedCount} mặt hàng từ file Excel!`);
      }
      e.target.value = null;
    };
    reader.readAsText(file, 'UTF-8');
  };

  const handleOpenItemModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setItemForm({ ...item, partNo: item.partNo || '' });
    } else {
      setEditingItem(null);
      setItemForm({ id: `MH00${items.length + 1}`, name: '', partNo: '', unit: 'Cái', minThreshold: 10 });
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

    if (newRequestType === 'TRANSFER' && reqWarehouse === reqDestWarehouse) {
      alert('Kho xuất và Kho nhập phải khác nhau khi điều chuyển nội bộ!');
      return;
    }

    const formattedItems = reqItemsList.map(ri => {
      const matchedItem = items.find(i => i.id === ri.itemId);
      return {
        itemId: ri.itemId,
        name: matchedItem ? matchedItem.name : '',
        partNo: matchedItem ? (matchedItem.partNo || '') : '',
        quantity: Number(ri.quantity) || 1,
        serialNotes: ri.serialNotes || ''
      };
    });

    let suffix = 'XK';
    if (newRequestType === 'IMPORT') suffix = 'NK';
    if (newRequestType === 'TRANSFER') suffix = 'CK';

    const finalVoucherId = customVoucherId.trim() || `${requests.length + 1}/26/${suffix}`;

    const newReq = {
      id: finalVoucherId,
      type: newRequestType,
      requesterName: reqRequesterName,
      customerName: newRequestType === 'TRANSFER' ? 'Điều chuyển Nội bộ' : reqCustomerName,
      warehouseId: reqWarehouse,
      destWarehouseId: newRequestType === 'TRANSFER' ? reqDestWarehouse : '',
      workType: reqWorkType,
      reasonType: newRequestType === 'IMPORT' ? '' : reqReasonType,
      contractNo: newRequestType === 'IMPORT' ? '' : reqContractNo,
      paymentAmount: newRequestType === 'IMPORT' ? '' : reqPaymentAmount,
      paymentDate: newRequestType === 'IMPORT' ? '' : reqPaymentDate,
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      approvedBy: '',
      items: formattedItems,
      note: reqNote,
      recipientEmails: ['cuongnt@honghatst.vn', 'an.nguyen@company.com']
    };

    setRequests([newReq, ...requests]);
    setSelectedPrintRequest(newReq);
    setIsRequestModalOpen(false);
    setCustomVoucherId('');
    showToast(`⚡ Đã tạo phiếu yêu cầu ${newReq.id} thành công!`);
  };

  const handleApproveRequest = (reqId, isApprove) => {
    const updatedRequests = requests.map(req => {
      if (req.id === reqId) {
        const newStatus = isApprove ? 'APPROVED' : 'REJECTED';
        
        if (isApprove) {
          setItems(prevItems => prevItems.map(item => {
            const reqItem = req.items.find(ri => ri.itemId === item.id);
            if (reqItem) {
              const srcStock = item.stock[req.warehouseId] || 0;

              if (req.type === 'EXPORT') {
                return {
                  ...item,
                  stock: { ...item.stock, [req.warehouseId]: Math.max(0, srcStock - reqItem.quantity) }
                };
              } else if (req.type === 'IMPORT') {
                return {
                  ...item,
                  stock: { ...item.stock, [req.warehouseId]: srcStock + reqItem.quantity }
                };
              } else if (req.type === 'TRANSFER') {
                const destStock = item.stock[req.destWarehouseId] || 0;
                return {
                  ...item,
                  stock: {
                    ...item.stock,
                    [req.warehouseId]: Math.max(0, srcStock - reqItem.quantity),
                    [req.destWarehouseId]: destStock + reqItem.quantity
                  }
                };
              }
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
    if (!req) return;
    const emails = (req.recipientEmails || ['cuongnt@honghatst.vn']).join(',');
    const typeTitle = req.type === 'IMPORT' ? 'Nhập kho' : req.type === 'TRANSFER' ? 'Chuyển kho' : 'Xuất kho';
    const subject = encodeURIComponent(`[THÔNG BÁO KHO] Phiếu ${typeTitle} ${req.id} - ${req.requesterName}`);
    const itemsSummary = req.items.map(i => `- ${i.name} (${i.partNo ? 'Part: ' + i.partNo + ', ' : ''}SL: ${i.quantity})`).join('\n');
    
    let whDetail = `Kho xuất: ${req.warehouseId === 'WH01' ? 'Hà Nội' : 'Hồ Chí Minh'}`;
    if (req.type === 'TRANSFER') {
      whDetail += ` -> Kho nhập: ${req.destWarehouseId === 'WH01' ? 'Hà Nội' : 'Hồ Chí Minh'}`;
    }

    const body = encodeURIComponent(
      `Kính gửi bộ phận liên quan,\n\n` +
      `Thông tin phiếu ${typeTitle} số: ${req.id}\n` +
      `- Người yêu cầu: ${req.requesterName}\n` +
      `- Đối tác/Khách hàng: ${req.customerName || 'N/A'}\n` +
      `- Chi tiết kho: ${whDetail}\n` +
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

  const handleStocktakeSave = (itemId, whId) => {
    const val = stocktakeInputs[itemId];
    if (val === undefined || val === '') return;
    
    setItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          stock: { ...item.stock, [whId]: Number(val) }
        };
      }
      return item;
    }));
    showToast(`Đã điều chỉnh tồn kho thực tế cho sản phẩm ${itemId}!`);
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(req => {
      const matchesSearch = req.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            req.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            req.requesterName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = requestFilterType === 'ALL' || req.type === requestFilterType;
      return matchesSearch && matchesType;
    });
  }, [requests, searchTerm, requestFilterType]);

  // Format hiển thị ngày tiếng Việt
  const formatDateVN = (dateStr) => {
    if (!dateStr) return 'tháng ... năm ...';
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `Ngày ${parts[2]} tháng ${parts[1]} năm ${parts[0]}`;
    }
    return dateStr;
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
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white leading-none">
                QUẢN LÝ KHO THÔNG MINH
              </h1>
              <span className="text-xs text-slate-400">Chuẩn TT 133/2016/TT-BTC</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden lg:flex items-center gap-2 bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full text-xs font-mono">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Realtime Online</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
              <Shield className="w-4 h-4 text-amber-400" />
              <select
                value={currentUserRole}
                onChange={(e) => setCurrentUserRole(e.target.value)}
                className="bg-slate-900 text-amber-400 text-xs font-semibold rounded px-1.5 py-1 border border-slate-600 focus:outline-none"
              >
                <option value="Management">Quản lý (Admin)</option>
                <option value="Warehouse">Nhân viên Kho</option>
                <option value="User">Người dùng thường</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN BODY & NAVIGATION TABS --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-grow w-full">
        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 mb-6 print:hidden">
          {[
            { id: 'dashboard', label: 'Báo cáo Trực quan', icon: TrendingUp },
            { id: 'inventory', label: 'Tồn kho & Cảnh báo', icon: Layers },
            { id: 'requests', label: 'Phiếu Nhập/Xuất & Duyệt', icon: Clock, badge: requests.filter(r => r.status === 'PENDING').length },
            { id: 'itemsDir', label: 'Quản lý Hàng hóa', icon: Package },
            { id: 'print', label: 'In Phiếu & Gửi Email', icon: Printer },
            { id: 'directory', label: 'NV & Khách hàng', icon: Users },
            { id: 'stocktake', label: 'Kiểm kê kho', icon: CheckSquare },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
                {tab.badge > 0 && (
                  <span className="ml-1 bg-amber-500 text-white text-2xs px-1.5 py-0.5 rounded-full font-bold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Mobile Dropdown Menu Selector */}
        <div className="md:hidden mb-4 print:hidden">
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Chọn chức năng:</label>
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm font-bold text-indigo-700 shadow-sm"
          >
            <option value="dashboard">📈 Báo cáo Trực quan</option>
            <option value="inventory">📦 Tồn kho & Cảnh báo</option>
            <option value="requests">⏱️ Phiếu Nhập/Xuất & Phê duyệt</option>
            <option value="itemsDir">🏷️ Quản lý Hàng hóa</option>
            <option value="print">🖨️ In Phiếu & Gửi Email</option>
            <option value="directory">👥 Quản lý NV & Khách hàng</option>
            <option value="stocktake">📋 Kiểm kê kho thực tế</option>
          </select>
        </div>

        {/* Toast Notification */}
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

        {/* ================= TAB 1: DASHBOARD & BÁO CÁO XUẤT NHẬP TỒN ================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* THỐNG KÊ TỔNG QUAN CHỈ SỐ */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="p-2.5 bg-blue-100 text-blue-600 rounded-lg">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xs font-semibold text-slate-500 uppercase">Tổng mã hàng</p>
                  <h3 className="text-lg font-bold text-slate-800">{items.length} Mã</h3>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-lg">
                  <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xs font-semibold text-slate-500 uppercase">Tổng nhập kho</p>
                  <h3 className="text-lg font-bold text-emerald-600">+{movementReport.totalImportQty} SP</h3>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="p-2.5 bg-amber-100 text-amber-600 rounded-lg">
                  <ArrowUpRight className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xs font-semibold text-slate-500 uppercase">Tổng xuất kho</p>
                  <h3 className="text-lg font-bold text-amber-600">-{movementReport.totalExportQty} SP</h3>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="p-2.5 bg-purple-100 text-purple-600 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xs font-semibold text-slate-500 uppercase">Giao dịch đã duyệt</p>
                  <h3 className="text-lg font-bold text-purple-700">{movementReport.totalApprovedCount} Phiếu</h3>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="p-2.5 bg-red-100 text-red-600 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xs font-semibold text-slate-500 uppercase">Dưới ngưỡng</p>
                  <h3 className="text-lg font-bold text-red-600">{lowStockItems.length} SP</h3>
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

            {/* BÁO CÁO XUẤT - NHẬP - TỒN BẢNG TỔNG HỢP */}
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-indigo-600" /> BÁO CÁO XUẤT - NHẬP - TỒN KHO TỔNG HỢP
                  </h3>
                  <p className="text-xs text-slate-500">Thống kê biến động xuất nhập kho dựa trên các phiếu đã được phê duyệt.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">Kho:</span>
                    <select
                      value={reportWarehouseFilter}
                      onChange={(e) => setReportWarehouseFilter(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold px-3 py-1.5 focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="ALL">Tất cả chi nhánh kho</option>
                      <option value="WH01">Kho Hà Nội (WH01)</option>
                      <option value="WH02">Kho Hồ Chí Minh (WH02)</option>
                    </select>
                  </div>

                  <button
                    onClick={() => handleExportCSV('IMPORT_EXPORT_REPORT')}
                    className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> Xuất Excel Báo Cáo
                  </button>
                </div>
              </div>

              {/* BẢNG BÁO CÁO CHI TIẾT XUẤT NHẬP TỒN */}
              <div className="overflow-x-auto">
                <table className="min-w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-3">Mã Hàng</th>
                      <th className="py-2.5 px-3">Tên Hàng Hóa</th>
                      <th className="py-2.5 px-3">ĐVT</th>
                      <th className="py-2.5 px-3 text-center text-emerald-700 bg-emerald-50/50">Tổng Nhập</th>
                      <th className="py-2.5 px-3 text-center text-amber-700 bg-amber-50/50">Tổng Xuất</th>
                      <th className="py-2.5 px-3 text-center font-bold">Tồn Hiện Tại</th>
                      <th className="py-2.5 px-3 text-center">Tỷ Lệ Nhập/Xuất</th>
                      <th className="py-2.5 px-3 text-center">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {movementReport.items.map(item => {
                      const totalActivity = item.totalImport + item.totalExport;
                      const importPercent = totalActivity > 0 ? Math.round((item.totalImport / totalActivity) * 100) : 50;
                      const isLow = item.currentStock <= item.minThreshold;

                      return (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{item.id}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{item.name}</td>
                          <td className="py-2.5 px-3 text-slate-600">{item.unit}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-emerald-600 bg-emerald-50/30">
                            +{item.totalImport}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-amber-600 bg-amber-50/30">
                            -{item.totalExport}
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-900">{item.currentStock}</td>
                          <td className="py-2.5 px-3 text-center w-36">
                            <div className="flex items-center gap-1.5">
                              <span className="text-2xs text-emerald-600 font-bold w-6">{importPercent}%</span>
                              <div className="w-full bg-amber-200 rounded-full h-2 overflow-hidden flex">
                                <div className="bg-emerald-500 h-full" style={{ width: `${importPercent}%` }}></div>
                              </div>
                              <span className="text-2xs text-amber-600 font-bold w-6">{100 - importPercent}%</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {isLow ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-red-100 text-red-700">
                                <AlertTriangle className="w-3 h-3" /> Cảnh báo tồn
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-emerald-100 text-emerald-700">
                                <CheckCircle className="w-3 h-3" /> Bình thường
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

            {/* BÁO CÁO ĐỒ HỌA TRỰC QUAN TIẾN TRÌNH TỒN KHO */}
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" /> Đồ họa Mức Tồn Kho So Với Định Mức An Toàn
              </h3>

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
                <h3 className="text-base sm:text-lg font-bold text-slate-800">DANH MỤC HÀNG HÓA & TỒN KHO PHÂN BỔ</h3>
                <p className="text-xs text-slate-500">Quản lý mã hàng, tồn kho thực tế ở từng chi nhánh kho và định mức an toàn.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer border border-indigo-200">
                  <Upload className="w-3.5 h-3.5" /> Nhập Excel Tồn Kho
                  <input type="file" accept=".csv" onChange={(e) => handleImportCSV(e, 'ITEMS')} className="hidden" />
                </label>

                <button
                  onClick={() => handleExportCSV('INVENTORY')}
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Xuất Excel Tồn Kho
                </button>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Tìm Mã / Tên hàng..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 w-full sm:w-48"
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
                    <th className="py-2.5 px-3">Part No</th>
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
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{item.id}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{item.name}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{item.partNo || '-'}</td>
                          <td className="py-2.5 px-3 text-slate-600">{item.unit}</td>
                          {warehouses.map(wh => (
                            <td key={wh.id} className="py-2.5 px-3 text-center font-semibold text-slate-700">
                              {item.stock[wh.id] || 0}
                            </td>
                          ))}
                          <td className="py-2.5 px-3 text-center font-bold text-slate-900">{totalStock}</td>
                          <td className="py-2.5 px-3 text-center text-slate-500 font-medium">{item.minThreshold}</td>
                          <td className="py-2.5 px-3 text-center">
                            {isLow ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-red-100 text-red-700">
                                <AlertTriangle className="w-3 h-3" /> Chạm ngưỡng
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-bold bg-emerald-100 text-emerald-700">
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

        {/* ================= TAB 3: PHIẾU NHẬP/XUẤT KHO & PHÊ DUYỆT ================= */}
        {activeTab === 'requests' && (
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">QUẢN LÝ PHIẾU NHẬP / XUẤT / CHUYỂN KHO</h3>
                <p className="text-xs text-slate-500">Tạo mới, xuất/nhập danh sách qua Excel và quản lý quy trình phê duyệt phiếu.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Tạo Phiếu Mới
                </button>

                <label className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer border border-indigo-200">
                  <Upload className="w-3.5 h-3.5" /> Nhập Excel Phiếu
                  <input type="file" accept=".csv" onChange={(e) => handleImportCSV(e, 'REQUESTS')} className="hidden" />
                </label>

                <button
                  onClick={() => handleExportCSV('REQUESTS')}
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Xuất Excel Phiếu
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-600">Lọc theo loại:</span>
                <select
                  value={requestFilterType}
                  onChange={(e) => setRequestFilterType(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="ALL">Tất cả loại phiếu</option>
                  <option value="IMPORT">📥 Phiếu Nhập Kho</option>
                  <option value="EXPORT">📤 Phiếu Xuất Kho</option>
                  <option value="TRANSFER">🔄 Phiếu Chuyển Kho</option>
                </select>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Tìm theo Mã phiếu, Khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs w-full focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Mã Phiếu</th>
                    <th className="py-2.5 px-3">Loại Phiếu</th>
                    <th className="py-2.5 px-3">Ngày Tạo</th>
                    <th className="py-2.5 px-3">Người Yêu Cầu</th>
                    <th className="py-2.5 px-3">Khách Hàng / Đối Tác</th>
                    <th className="py-2.5 px-3 text-center">Kho Thực Hiện</th>
                    <th className="py-2.5 px-3 text-center">Trạng Thái</th>
                    <th className="py-2.5 px-3 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRequests.map(req => {
                    const isImport = req.type === 'IMPORT';
                    const isTransfer = req.type === 'TRANSFER';
                    const srcWhName = req.warehouseId === 'WH01' ? 'Hà Nội' : 'Hồ Chí Minh';
                    const destWhName = req.destWarehouseId === 'WH01' ? 'Hà Nội' : 'Hồ Chí Minh';

                    return (
                      <tr key={req.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{req.id}</td>
                        <td className="py-2.5 px-3">
                          {isImport && (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-600" /> Nhập kho
                            </span>
                          )}
                          {!isImport && !isTransfer && (
                            <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" /> Xuất kho
                            </span>
                          )}
                          {isTransfer && (
                            <span className="inline-flex items-center gap-1 font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" /> Chuyển kho
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">{req.date}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-800">{req.requesterName}</td>
                        <td className="py-2.5 px-3 text-slate-700">{req.customerName || '-'}</td>
                        <td className="py-2.5 px-3 text-center font-semibold text-slate-600">
                          {isTransfer ? `${srcWhName} ➔ ${destWhName}` : srcWhName}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          {req.status === 'APPROVED' && (
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full text-2xs font-bold">
                              <CheckCircle className="w-3 h-3" /> Đã duyệt
                            </span>
                          )}
                          {req.status === 'REJECTED' && (
                            <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-2xs font-bold">
                              <XCircle className="w-3 h-3" /> Từ chối
                            </span>
                          )}
                          {req.status === 'PENDING' && (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full text-2xs font-bold">
                              <Clock className="w-3 h-3" /> Chờ duyệt
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {req.status === 'PENDING' && currentUserRole !== 'User' && (
                              <>
                                <button
                                  onClick={() => handleApproveRequest(req.id, true)}
                                  className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                                  title="Duyệt phiếu"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleApproveRequest(req.id, false)}
                                  className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                                  title="Từ chối phiếu"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => {
                                setSelectedPrintRequest(req);
                                setActiveTab('print');
                              }}
                              className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded text-2xs flex items-center gap-1 border border-slate-300"
                              title="In phiếu / Gửi Mail"
                            >
                              <Printer className="w-3 h-3" /> Xem & In
                            </button>
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

        {/* ================= TAB 4: QUẢN LÝ DANH MỤC HÀNG HÓA ================= */}
        {activeTab === 'itemsDir' && (
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">DANH MỤC SẢN PHẨM & VẬT TƯ</h3>
                <p className="text-xs text-slate-500">Thêm, sửa, xóa các mã vật tư trong danh mục quản lý.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOpenItemModal()}
                  className="flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Thêm Mã Hàng
                </button>

                <label className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer border border-indigo-200">
                  <Upload className="w-3.5 h-3.5" /> Nhập Excel
                  <input type="file" accept=".csv" onChange={(e) => handleImportCSV(e, 'ITEMS')} className="hidden" />
                </label>

                <button
                  onClick={() => handleExportCSV('INVENTORY')}
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Xuất Excel
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Mã Hàng</th>
                    <th className="py-2.5 px-3">Tên Hàng Hóa</th>
                    <th className="py-2.5 px-3">Part No</th>
                    <th className="py-2.5 px-3">Đơn Vị Tính</th>
                    <th className="py-2.5 px-3 text-center">Ngưỡng An Toàn</th>
                    <th className="py-2.5 px-3 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{item.id}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{item.name}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">{item.partNo || '-'}</td>
                      <td className="py-2.5 px-3 text-slate-600">{item.unit}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-700">{item.minThreshold}</td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenItemModal(item)}
                            className="p-1 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1 text-slate-600 hover:text-red-600 hover:bg-slate-100 rounded"
                            title="Xóa"
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

        {/* ================= TAB 5: IN PHIẾU & GỬI EMAIL (MẪU ẨN/HIỆN CHUẨN) ================= */}
        {activeTab === 'print' && selectedPrintRequest && (
          <div className="space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">IN PHIẾU & GỬI EMAIL THÔNG BÁO</h3>
                <p className="text-xs text-slate-500">Xem trước và in phiếu kho chuẩn định dạng báo cáo.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleOpenGmailWeb(selectedPrintRequest)}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-sm"
                >
                  <Mail className="w-4 h-4" /> Gửi Gmail Thông Báo
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-sm"
                >
                  <Printer className="w-4 h-4" /> In Phiếu Kho
                </button>
              </div>
            </div>

            {/* MẪU IN PHIẾU KHO HIỂN THỊ DỘNG THEO LOẠI PHIẾU */}
            <div className="bg-white p-8 rounded-xl border border-slate-300 shadow-md max-w-3xl mx-auto text-slate-900 font-sans print:shadow-none print:border-none print:p-0">
              {/* Header Góc Phải */}
              <div className="text-right text-xs text-slate-700 mb-4">
                <p className="font-semibold">Mẫu số 02 - VT</p>
                <p className="text-2xs italic text-slate-600">(Ban hành theo Thông tư số 133/2016/TT-BTC</p>
                <p className="text-2xs italic text-slate-600">Ngày 26/08/2016 của Bộ Tài chính)</p>
              </div>

              {/* Tên Tiêu Đề Phiếu Dynamic */}
              <div className="text-center mb-6">
                <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wide">
                  {selectedPrintRequest.type === 'IMPORT' 
                    ? 'PHIẾU NHẬP KHO' 
                    : selectedPrintRequest.type === 'TRANSFER' 
                      ? 'PHIẾU CHUYỂN KHO NỘI BỘ' 
                      : 'PHIẾU XUẤT KHO'}
                </h1>
                <p className="text-xs italic text-slate-700 mt-1">
                  {formatDateVN(selectedPrintRequest.date)}
                </p>
                <p className="text-sm font-bold italic mt-1">
                  Số phiếu: <span className="font-mono">{selectedPrintRequest.id}</span>
                </p>
              </div>

              {/* Các trường thông tin căn lề trái & Ẩn/Hiện linh hoạt */}
              <div className="space-y-2.5 text-xs sm:text-sm mb-6 text-left leading-relaxed">
                <div className="flex">
                  <span className="w-56 font-semibold">1. Họ và tên người yêu cầu:</span>
                  <span className="font-bold text-slate-900">{selectedPrintRequest.requesterName}</span>
                </div>

                <div className="flex">
                  <span className="w-56 font-semibold">
                    2. {selectedPrintRequest.type === 'IMPORT' ? 'Tên nhà cung cấp:' : 'Tên khách hàng/Đối tác:'}
                  </span>
                  <span>{selectedPrintRequest.customerName || '...........................................................................................'}</span>
                </div>

                {/* Kho xuất / kho nhập hiển thị phù hợp */}
                <div className="flex items-center gap-6">
                  <span className="w-56 font-semibold">
                    3. {selectedPrintRequest.type === 'TRANSFER' ? 'Chuyển từ kho đến kho:' : selectedPrintRequest.type === 'IMPORT' ? 'Nhập tại kho:' : 'Xuất tại kho:'}
                  </span>
                  {selectedPrintRequest.type === 'TRANSFER' ? (
                    <span className="font-bold text-indigo-700">
                      Kho {selectedPrintRequest.warehouseId === 'WH01' ? 'Hà Nội' : 'Hồ Chí Minh'} ➔ Kho {selectedPrintRequest.destWarehouseId === 'WH01' ? 'Hà Nội' : 'Hồ Chí Minh'}
                    </span>
                  ) : (
                    <div className="flex items-center gap-6">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="font-bold">{selectedPrintRequest.warehouseId === 'WH01' ? '☑' : '☐'}</span> Hà Nội
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="font-bold">{selectedPrintRequest.warehouseId === 'WH02' ? '☑' : '☐'}</span> Hồ Chí Minh
                      </span>
                    </div>
                  )}
                </div>

                {/* Chỉ hiện Mục 4 khi là Phiếu Xuất Kho */}
                {selectedPrintRequest.type === 'EXPORT' && (
                  <div className="space-y-1">
                    <span className="font-semibold block">4. Sửa chữa/ Bán máy:</span>
                    <div className="grid grid-cols-2 gap-y-1.5 pl-6 pt-1">
                      <span className="inline-flex items-center gap-2">
                        <span className="font-bold">{selectedPrintRequest.workType === 'REPAIR_SINGLE' ? '☑' : '☐'}</span> Sửa chữa lẻ
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="font-bold">{selectedPrintRequest.workType === 'REPAIR_PROJECT' ? '☑' : '☐'}</span> Sửa chữa dự án
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="font-bold">{selectedPrintRequest.workType === 'SALE_SINGLE' ? '☑' : '☐'}</span> Bán máy lẻ
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="font-bold">{selectedPrintRequest.workType === 'SALE_PROJECT' ? '☑' : '☐'}</span> Bán máy dự án
                      </span>
                    </div>
                  </div>
                )}

                {/* Mục Lý do chỉ hiển thị khi không phải là Phiếu Nhập Kho */}
                {selectedPrintRequest.type !== 'IMPORT' && (
                  <div className="space-y-1 pt-1">
                    <span className="font-semibold block">
                      {selectedPrintRequest.type === 'TRANSFER' ? '4. Lý do chuyển kho:' : '5. Lý do xuất kho:'}
                    </span>
                    <div className="flex items-center gap-8 pl-6 pt-1">
                      <span className="inline-flex items-center gap-2">
                        <span className="font-bold">{selectedPrintRequest.reasonType === 'SERVICE' ? '☑' : '☐'}</span> Dịch vụ
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="font-bold">{selectedPrintRequest.reasonType === 'WARRANTY' ? '☑' : '☐'}</span> Bảo hành
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <span className="font-bold">{selectedPrintRequest.reasonType === 'INTERNAL' ? '☑' : '☐'}</span> Nội bộ
                      </span>
                    </div>
                  </div>
                )}

                {/* Các mục hợp đồng / tài chính chỉ hiển thị khi là Phiếu Xuất Kho */}
                {selectedPrintRequest.type === 'EXPORT' && (
                  <>
                    <div className="flex pt-1">
                      <span className="w-56 font-semibold">6. Số Hợp đồng/ Báo giá:</span>
                      <span>{selectedPrintRequest.contractNo || '...........................................................................................'}</span>
                    </div>

                    <div className="flex pt-1">
                      <span className="w-56 font-semibold">7. Số tiền (nếu đã thanh toán):</span>
                      <span className="flex-grow">
                        {selectedPrintRequest.paymentAmount || '...........................................'} 
                        <span className="ml-4 font-semibold">Ngày thanh toán:</span> {selectedPrintRequest.paymentDate || '..........................'}
                      </span>
                    </div>
                  </>
                )}

                {selectedPrintRequest.note && (
                  <div className="flex pt-1 italic text-slate-700">
                    <span className="w-56 font-semibold not-italic">Diễn giải/Ghi chú:</span>
                    <span>{selectedPrintRequest.note}</span>
                  </div>
                )}
              </div>

              {/* BẢNG SẢN PHẨM / VẬT TƯ CHUẨN 5 CỘT */}
              <table className="min-w-full border-collapse border border-slate-900 text-xs sm:text-sm mb-8">
                <thead>
                  <tr className="bg-slate-50 text-center font-bold border-b border-slate-900 uppercase">
                    <th className="border border-slate-900 p-2 w-12">STT</th>
                    <th className="border border-slate-900 p-2">TÊN HÀNG HÓA</th>
                    <th className="border border-slate-900 p-2 w-32">PART NO</th>
                    <th className="border border-slate-900 p-2 w-20">SỐ LƯỢNG</th>
                    <th className="border border-slate-900 p-2">GHI CHÚ – SERIAL</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPrintRequest.items.map((it, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="border border-slate-900 p-2 font-medium">{idx + 1}</td>
                      <td className="border border-slate-900 p-2 text-left font-semibold">{it.name}</td>
                      <td className="border border-slate-900 p-2 font-mono">{it.partNo || it.itemId}</td>
                      <td className="border border-slate-900 p-2 font-bold">{it.quantity}</td>
                      <td className="border border-slate-900 p-2 text-left text-slate-800">{it.serialNotes || '-'}</td>
                    </tr>
                  ))}
                  {/* Dòng Tổng Cộng */}
                  <tr className="font-bold text-center bg-slate-50/50">
                    <td className="border border-slate-900 p-2"></td>
                    <td className="border border-slate-900 p-2 text-center uppercase">Cộng</td>
                    <td className="border border-slate-900 p-2"></td>
                    <td className="border border-slate-900 p-2 text-center text-sm">
                      {selectedPrintRequest.items.reduce((acc, curr) => acc + Number(curr.quantity), 0)}
                    </td>
                    <td className="border border-slate-900 p-2"></td>
                  </tr>
                </tbody>
              </table>

              {/* CHỮ KÝ 3 CỘT */}
              <div className="grid grid-cols-3 gap-4 text-center text-xs sm:text-sm font-semibold pt-4">
                <div>
                  <p className="font-bold">
                    {selectedPrintRequest.type === 'IMPORT' ? 'Người giao hàng' : 'Người nhận hàng'}
                  </p>
                  <p className="text-2xs italic text-slate-600 font-normal">(Ký, họ tên)</p>
                  <div className="h-20"></div>
                </div>
                <div>
                  <p className="font-bold">Kế toán</p>
                  <p className="text-2xs italic text-slate-600 font-normal">(Ký, họ tên)</p>
                  <div className="h-20"></div>
                </div>
                <div>
                  <p className="font-bold">Thủ kho</p>
                  <p className="text-2xs italic text-slate-600 font-normal">(Ký, họ tên)</p>
                  <div className="h-20"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 6: NHÂN VIÊN & KHÁCH HÀNG ================= */}
        {activeTab === 'directory' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* DANH SÁCH NHÂN VIÊN */}
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" /> DANH SÁCH NHÂN VIÊN
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEmpModal()}
                    className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm
                  </button>
                  <label className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold cursor-pointer border border-indigo-200 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" /> Nhập Excel
                    <input type="file" accept=".csv" onChange={(e) => handleImportCSV(e, 'EMPLOYEES')} className="hidden" />
                  </label>
                  <button
                    onClick={() => handleExportCSV('EMPLOYEES')}
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> Xuất Excel
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 font-semibold text-slate-700">
                      <th className="p-2">Mã NV</th>
                      <th className="p-2">Họ và Tên</th>
                      <th className="p-2">Chức Danh</th>
                      <th className="p-2">Email</th>
                      <th className="p-2 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {employees.map(emp => (
                      <tr key={emp.id} className="hover:bg-slate-50">
                        <td className="p-2 font-mono font-bold text-indigo-600">{emp.id}</td>
                        <td className="p-2 font-semibold">{emp.name}</td>
                        <td className="p-2 text-slate-600">{emp.title}</td>
                        <td className="p-2 text-slate-500">{emp.email}</td>
                        <td className="p-2 text-center">
                          <button onClick={() => handleDeleteEmployee(emp.id)} className="text-red-600 hover:text-red-800 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* DANH SÁCH KHÁCH HÀNG */}
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" /> DANH SÁCH KHÁCH HÀNG
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenCustModal()}
                    className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm
                  </button>
                  <label className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold cursor-pointer border border-indigo-200 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" /> Nhập Excel
                    <input type="file" accept=".csv" onChange={(e) => handleImportCSV(e, 'CUSTOMERS')} className="hidden" />
                  </label>
                  <button
                    onClick={() => handleExportCSV('CUSTOMERS')}
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> Xuất Excel
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 font-semibold text-slate-700">
                      <th className="p-2">Mã KH</th>
                      <th className="p-2">Tên Đầy Đủ</th>
                      <th className="p-2">Liên Hệ</th>
                      <th className="p-2">SĐT</th>
                      <th className="p-2 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {customers.map(cust => (
                      <tr key={cust.id} className="hover:bg-slate-50">
                        <td className="p-2 font-mono font-bold text-indigo-600">{cust.code}</td>
                        <td className="p-2 font-semibold">{cust.fullName}</td>
                        <td className="p-2 text-slate-600">{cust.contact}</td>
                        <td className="p-2 text-slate-500">{cust.phone}</td>
                        <td className="p-2 text-center">
                          <button onClick={() => handleDeleteCustomer(cust.id)} className="text-red-600 hover:text-red-800 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 7: KIỂM KÊ KHO THỰC TẾ ================= */}
        {activeTab === 'stocktake' && (
          <div className="bg-white p-4 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">KIỂM KÊ KHO THỰC TẾ & ĐIỀU CHỈNH</h3>
                <p className="text-xs text-slate-500">Đối chiếu số lượng phần mềm ghi nhận với kiểm đếm kho thực tế.</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 mr-2">
                  <span className="text-xs font-bold text-slate-700">Chọn Kho:</span>
                  <select
                    value={stocktakeWH}
                    onChange={(e) => setStocktakeWH(e.target.value)}
                    className="border border-slate-300 rounded-lg text-xs font-bold p-2 bg-slate-50"
                  >
                    <option value="WH01">Kho Hà Nội</option>
                    <option value="WH02">Kho Hồ Chí Minh</option>
                  </select>
                </div>

                <label className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg text-xs font-bold cursor-pointer border border-indigo-200">
                  <Upload className="w-3.5 h-3.5" /> Nhập Excel Kiểm Kê
                  <input type="file" accept=".csv" onChange={(e) => handleImportCSV(e, 'STOCKTAKE')} className="hidden" />
                </label>

                <button
                  onClick={() => handleExportCSV('STOCKTAKE')}
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-lg text-xs font-bold shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> Xuất Excel Kiểm Kê
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <th className="py-2.5 px-3">Mã Hàng</th>
                    <th className="py-2.5 px-3">Tên Hàng Hóa</th>
                    <th className="py-2.5 px-3 text-center">Tồn Máy Tính</th>
                    <th className="py-2.5 px-3 text-center">Tồn Thực Tế Kiểm Kê</th>
                    <th className="py-2.5 px-3 text-center">Chênh Lệch</th>
                    <th className="py-2.5 px-3 text-center">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {items.map(item => {
                    const currentStock = item.stock[stocktakeWH] || 0;
                    const inputVal = stocktakeInputs[item.id] !== undefined ? stocktakeInputs[item.id] : currentStock;
                    const diff = Number(inputVal) - currentStock;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-600">{item.id}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-800">{item.name}</td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-700">{currentStock}</td>
                        <td className="py-2.5 px-3 text-center">
                          <input
                            type="number"
                            value={inputVal}
                            onChange={(e) => setStocktakeInputs({ ...stocktakeInputs, [item.id]: e.target.value })}
                            className="w-20 text-center border border-slate-300 rounded p-1 font-bold focus:ring-2 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold">
                          {diff === 0 && <span className="text-slate-400">0</span>}
                          {diff > 0 && <span className="text-emerald-600">+{diff} (Thừa)</span>}
                          {diff < 0 && <span className="text-red-600">{diff} (Thiếu)</span>}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleStocktakeSave(item.id, stocktakeWH)}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-2xs font-bold rounded"
                          >
                            Cập nhật
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
      </div>

      {/* --- MODAL TẠO PHIẾU YÊU CẦU NHẬP / XUẤT / CHUYỂN KHO --- */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-800">TẠO PHIẾU GIAO DỊCH KHO MỚI</h3>
              <button onClick={() => setIsRequestModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Loại Phiếu:</label>
                  <select
                    value={newRequestType}
                    onChange={(e) => setNewRequestType(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-bold bg-slate-50"
                  >
                    <option value="EXPORT">📤 Phiếu Xuất Kho</option>
                    <option value="IMPORT">📥 Phiếu Nhập Kho</option>
                    <option value="TRANSFER">🔄 Phiếu Chuyển Kho Nội Bộ</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mã Phiếu (Tùy chọn):</label>
                  <input
                    type="text"
                    placeholder="VD: /26/"
                    value={customVoucherId}
                    onChange={(e) => setCustomVoucherId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Họ và tên người yêu cầu:</label>
                  <input
                    type="text"
                    required
                    value={reqRequesterName}
                    onChange={(e) => setReqRequesterName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                {newRequestType !== 'TRANSFER' ? (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {newRequestType === 'IMPORT' ? 'Nhà cung cấp / Đối tác:' : 'Tên khách hàng:'}
                    </label>
                    <input
                      type="text"
                      value={reqCustomerName}
                      onChange={(e) => setReqCustomerName(e.target.value)}
                      placeholder={newRequestType === 'IMPORT' ? 'Nhập tên NCC...' : 'Nhập tên khách hàng...'}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mục đích chuyển kho:</label>
                    <input
                      type="text"
                      disabled
                      value="Điều chuyển Hàng hóa Nội bộ"
                      className="w-full border border-slate-200 rounded-lg p-2 bg-slate-100 font-medium text-slate-600"
                    />
                  </div>
                )}
              </div>

              {/* Lựa chọn kho xuất / kho nhập */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {newRequestType === 'TRANSFER' ? 'Kho xuất (Kho đi):' : newRequestType === 'IMPORT' ? 'Nhập tại kho:' : 'Xuất tại kho:'}
                  </label>
                  <select
                    value={reqWarehouse}
                    onChange={(e) => setReqWarehouse(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-semibold text-indigo-700"
                  >
                    <option value="WH01">Hà Nội (WH01)</option>
                    <option value="WH02">Hồ Chí Minh (WH02)</option>
                  </select>
                </div>

                {newRequestType === 'TRANSFER' ? (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kho nhập (Kho đến):</label>
                    <select
                      value={reqDestWarehouse}
                      onChange={(e) => setReqDestWarehouse(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 font-semibold text-emerald-700"
                    >
                      <option value="WH02">Hồ Chí Minh (WH02)</option>
                      <option value="WH01">Hà Nội (WH01)</option>
                    </select>
                  </div>
                ) : (
                  newRequestType === 'EXPORT' && (
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Mục 4. Sửa chữa/ Bán máy:</label>
                      <select
                        value={reqWorkType}
                        onChange={(e) => setReqWorkType(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg p-2"
                      >
                        <option value="REPAIR_SINGLE">Sửa chữa lẻ</option>
                        <option value="REPAIR_PROJECT">Sửa chữa dự án</option>
                        <option value="SALE_SINGLE">Bán máy lẻ</option>
                        <option value="SALE_PROJECT">Bán máy dự án</option>
                      </select>
                    </div>
                  )
                )}
              </div>

              {/* Chỉ hiển thị Lý do, Hợp đồng & Thanh toán nếu KHÔNG phải Phiếu Nhập Kho */}
              {newRequestType !== 'IMPORT' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Lý do giao dịch:</label>
                    <select
                      value={reqReasonType}
                      onChange={(e) => setReqReasonType(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    >
                      <option value="INTERNAL">Nội bộ</option>
                      <option value="SERVICE">Dịch vụ</option>
                      <option value="WARRANTY">Bảo hành</option>
                    </select>
                  </div>

                  {newRequestType === 'EXPORT' && (
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Số Hợp đồng/ Báo giá:</label>
                      <input
                        type="text"
                        value={reqContractNo}
                        onChange={(e) => setReqContractNo(e.target.value)}
                        placeholder="VD: HD-2026/01"
                        className="w-full border border-slate-300 rounded-lg p-2"
                      />
                    </div>
                  )}
                </div>
              )}

              {newRequestType === 'EXPORT' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Số tiền (nếu thanh toán):</label>
                    <input
                      type="text"
                      value={reqPaymentAmount}
                      onChange={(e) => setReqPaymentAmount(e.target.value)}
                      placeholder="VD: 5.000.000 đ"
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Ngày thanh toán:</label>
                    <input
                      type="date"
                      value={reqPaymentDate}
                      onChange={(e) => setReqPaymentDate(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2"
                    />
                  </div>
                </div>
              )}

              {/* Danh sách vật tư & HIỂN THỊ TỒN KHO THỰC TẾ TRỰC QUAN */}
              <div className="space-y-3 border-t pt-3">
                <div className="flex justify-between items-center">
                  <label className="block font-bold text-slate-700">Chi Tiết Vật Tư / Hàng Hóa:</label>
                  <span className="text-2xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    Kho xuất: {reqWarehouse === 'WH01' ? 'Hà Nội' : 'Hồ Chí Minh'}
                  </span>
                </div>

                {reqItemsList.map((row, idx) => {
                  const selectedItemObj = items.find(i => i.id === row.itemId);
                  const availableStock = selectedItemObj ? (selectedItemObj.stock[reqWarehouse] || 0) : 0;
                  const isOverStock = (newRequestType === 'EXPORT' || newRequestType === 'TRANSFER') && Number(row.quantity) > availableStock;

                  return (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                      <div className="flex items-center gap-2">
                        <select
                          value={row.itemId}
                          onChange={(e) => {
                            const updated = [...reqItemsList];
                            updated[idx].itemId = e.target.value;
                            setReqItemsList(updated);
                          }}
                          className="flex-grow border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                        >
                          {items.map(i => (
                            <option key={i.id} value={i.id}>
                              {i.name} ({i.partNo ? 'Part: ' + i.partNo : i.id})
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          min="1"
                          value={row.quantity}
                          onChange={(e) => {
                            const updated = [...reqItemsList];
                            updated[idx].quantity = e.target.value;
                            setReqItemsList(updated);
                          }}
                          className="w-20 border border-slate-300 rounded-lg p-2 text-xs font-bold text-center"
                        />

                        {reqItemsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => setReqItemsList(reqItemsList.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Thông số Tồn kho của sản phẩm đang chọn */}
                      <div className="flex items-center justify-between text-2xs px-1">
                        <span className="text-slate-500 font-medium">
                          Tồn kho hiện tại: <strong className="text-slate-800">{availableStock} {selectedItemObj?.unit || 'Cái'}</strong>
                        </span>

                        <input
                          type="text"
                          placeholder="Ghi chú / Số Serial"
                          value={row.serialNotes || ''}
                          onChange={(e) => {
                            const updated = [...reqItemsList];
                            updated[idx].serialNotes = e.target.value;
                            setReqItemsList(updated);
                          }}
                          className="w-48 border border-slate-300 rounded p-1 text-2xs"
                        />
                      </div>

                      {isOverStock && (
                        <p className="text-2xs font-bold text-red-600 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Số lượng xuất ({row.quantity}) vượt quá tồn kho khả dụng ({availableStock})!
                        </p>
                      )}
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setReqItemsList([...reqItemsList, { itemId: items[0]?.id || '', quantity: 1, serialNotes: '' }])}
                  className="text-2xs font-bold text-indigo-600 hover:underline flex items-center gap-1 mt-1"
                >
                  <Plus className="w-3 h-3" /> Thêm dòng vật tư
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Ghi Chú / Diễn Giải:</label>
                <textarea
                  rows="2"
                  value={reqNote}
                  onChange={(e) => setReqNote(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                  placeholder="Nhập ghi chú lý do xuất/nhập/chuyển kho..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold hover:bg-slate-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
                >
                  Tạo Phiếu Kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL THÊM / SỬA HÀNG HÓA --- */}
      {isItemModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-800">
                {editingItem ? 'SỬA THÔNG TIN MẶT HÀNG' : 'THÊM MẶT HÀNG MỚI'}
              </h3>
              <button onClick={() => setIsItemModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã Hàng Hóa:</label>
                <input
                  type="text"
                  required
                  disabled={!!editingItem}
                  value={itemForm.id}
                  onChange={(e) => setItemForm({ ...itemForm, id: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Hàng Hóa / Vật Tư:</label>
                <input
                  type="text"
                  required
                  value={itemForm.name}
                  onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">PART NO (Mã phụ/Mã linh kiện):</label>
                <input
                  type="text"
                  value={itemForm.partNo || ''}
                  onChange={(e) => setItemForm({ ...itemForm, partNo: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  placeholder="VD: PWT52012424A"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Đơn Vị Tính:</label>
                  <input
                    type="text"
                    required
                    value={itemForm.unit}
                    onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ngưỡng An Toàn:</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={itemForm.minThreshold}
                    onChange={(e) => setItemForm({ ...itemForm, minThreshold: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t pt-3">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL THÊM / SỬA NHÂN VIÊN --- */}
      {isEmployeeModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-800">
                {editingEmployee ? 'SỬA THÔNG TIN NHÂN VIÊN' : 'THÊM NHÂN VIÊN MỚI'}
              </h3>
              <button onClick={() => setIsEmployeeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã Nhân Viên:</label>
                <input
                  type="text"
                  required
                  value={empForm.id}
                  onChange={(e) => setEmpForm({ ...empForm, id: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Họ và Tên:</label>
                <input
                  type="text"
                  required
                  value={empForm.name}
                  onChange={(e) => setEmpForm({ ...empForm, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chức Danh:</label>
                <input
                  type="text"
                  value={empForm.title}
                  onChange={(e) => setEmpForm({ ...empForm, title: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email:</label>
                <input
                  type="email"
                  required
                  value={empForm.email}
                  onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 border-t pt-3">
                <button
                  type="button"
                  onClick={() => setIsEmployeeModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL THÊM / SỬA KHÁCH HÀNG --- */}
      {isCustomerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-bold text-slate-800">
                {editingCustomer ? 'SỬA KHÁCH HÀNG / ĐỐI TÁC' : 'THÊM KHÁCH HÀNG MỚI'}
              </h3>
              <button onClick={() => setIsCustomerModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mã Tắt / Viết Tắt:</label>
                <input
                  type="text"
                  required
                  value={custForm.code}
                  onChange={(e) => setCustForm({ ...custForm, code: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tên Đầy Đủ Khách Hàng / Đối Tác:</label>
                <input
                  type="text"
                  required
                  value={custForm.fullName}
                  onChange={(e) => setCustForm({ ...custForm, fullName: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Người Liên Hệ:</label>
                  <input
                    type="text"
                    value={custForm.contact}
                    onChange={(e) => setCustForm({ ...custForm, contact: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Số Điện Thoại:</label>
                  <input
                    type="text"
                    value={custForm.phone}
                    onChange={(e) => setCustForm({ ...custForm, phone: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Địa Chỉ:</label>
                <input
                  type="text"
                  value={custForm.address}
                  onChange={(e) => setCustForm({ ...custForm, address: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 border-t pt-3">
                <button
                  type="button"
                  onClick={() => setIsCustomerModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}