import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { SelectionOverlay } from './SelectionOverlay';
import { type Artwork, type ApiResponse, API_URL } from '../types';
import axios from 'axios';

// Define the structure for manual selection.

interface ManualSelectionRecord {
    [key: number]: {
        selected: boolean;
        index: number;
    };
}

export const ArtworkTable: React.FC = () => {

    // Basic states

    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    
    // Pagination Simple states manage)

    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(12);
    const [page, setPage] = useState(1);

    // Selection logic states used

    const [bulkNumber, setBulkNumber] = useState<number>(0);
    const [manualMap, setManualMap] = useState<ManualSelectionRecord>({}); 
    const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);

    const totalSelectedCount = useMemo(() => {
        let count = bulkNumber;
        
        Object.values(manualMap).forEach((data) => {
            if (data.selected && data.index > bulkNumber) {
                count++;
            } else if (!data.selected && data.index <= bulkNumber) {
                count--;
            }
        });

        return count < 0 ? 0 : count;
    }, [bulkNumber, manualMap]);

    // Data fetching function
    const loadArtworks = useCallback(async (p: number) => {
        setLoading(true);
        try {
            const response = await axios.get<ApiResponse>(`${API_URL}?page=${p}`);
            if (response.data) {
                setArtworks(response.data.data);
                setTotalRecords(response.data.pagination.total);
            }
        } catch (error) {
            console.error("Data fetching failed:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadArtworks(page);
    }, [page, loadArtworks]);

    //This effect syncs the tables visual checkboxes

    useEffect(() => {
        const rowsToHighlight = artworks.filter((item, idx) => {
            const globalIdx = ((page - 1) * rows) + idx + 1;
            
            // Priority 1: Users manual click
            if (manualMap[item.id] !== undefined) {
                return manualMap[item.id].selected;
            }
            return globalIdx <= bulkNumber;
        });
// Prioreity 2: Bulk selection intent

        setSelectedRows(rowsToHighlight);
    }, [artworks, manualMap, bulkNumber, page, rows]);

    //  When user clicks a checkbox in the table

    const onSelectionChange = (e: { value: Artwork[] }) => {
        const nextMap = { ...manualMap };
        const selectedOnPageIds = new Set(e.value.map(a => a.id));

        artworks.forEach((item, idx) => {
            const gIdx = ((page - 1) * rows) + idx + 1;
            const isNowSelected = selectedOnPageIds.has(item.id);
            
            //store the changes
            nextMap[item.id] = { selected: isNowSelected, index: gIdx };
        });

        setManualMap(nextMap);
    };

    const handleBulkSelect = (val: number) => {
        setBulkNumber(val);
        setManualMap({});
     // Reset manual clicks when new bulk number is enter
    };

    const onPageChange = (event: any) => {
        setFirst(event.first);
        setRows(event.rows);
        setPage((event.page ?? 0) + 1);
    };

    // Header Checkbox Logic - determines if all items om the current page are selected

    const isCurrentPageFull = artworks.length > 0 && 
        artworks.every(a => selectedRows.some(s => s.id === a.id));

    const toggleCurrentPage = () => {
        const nextMap = { ...manualMap };
        const targetSelection = !isCurrentPageFull;

        artworks.forEach((item, idx) => {
            const gIdx = ((page - 1) * rows) + idx + 1;
            nextMap[item.id] = { selected: targetSelection, index: gIdx };
        });
        setManualMap(nextMap);
    };

    // custom header for the checkbox culumn

    const renderSelectionHeader = () => (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input 
                type="checkbox" 
                checked={isCurrentPageFull} 
                onChange={toggleCurrentPage}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <SelectionOverlay onSelect={handleBulkSelect} />
        </div>
    );

    return (
        <div className="artwork_container">
            <div style={{ padding: '15px 0', fontWeight: '600', fontSize: '1.1rem', color:"black" }}>
                Total Records Selected: <span style={{ color: '#2196F3' }}>
                    {totalSelectedCount}
                </span>
            </div>

            <DataTable
                value={artworks}
                lazy
                paginator
                first={first}
                rows={rows}
                totalRecords={totalRecords}
                onPage={onPageChange}
                loading={loading}
                selection={selectedRows}
                onSelectionChange={onSelectionChange}
                selectionMode="multiple"
                dataKey="id"
                tableStyle={{ minWidth: '60rem' }}
                className="p-datatable-sm"
            >
                <Column 
                    selectionMode="multiple" 
                    header={renderSelectionHeader} 
                    headerStyle={{ width: '4rem' }} 
                />
                <Column field="title" header="Title" sortable />
                <Column field="place_of_origin" header="Origin" />
                <Column field="artist_display" header="Artist" />
                <Column field="date_start" header="Start Year" />
                <Column field="date_end" header="End Year" />
            </DataTable>
        </div>
    );
};
