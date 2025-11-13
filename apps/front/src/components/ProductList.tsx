import * as React from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import RefreshIcon from "@mui/icons-material/Refresh";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRowParams,
  //   GridValueFormatterParams,
  gridClasses,
} from "@mui/x-data-grid";
import { type Product } from "@admin-dashboard/types";
import { useNavigate } from "react-router-dom";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "../api/product";
import { useAuth } from "../auth/useAuth";
import { sanitizeInput } from "../lib/sanitize";
import ProductModal from "./ProductModal";

const INITIAL_PAGE_SIZE = 10;

export default function ProductList() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [rows, setRows] = React.useState<Product[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState<"create" | "edit">("create");
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(
    null
  );
  const [modalError, setModalError] = React.useState<string | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const loadData = React.useCallback(async () => {
    if (!token) {
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const result = await getProducts({ token });
      setRows(
        result.items.map((item) => ({
          ...item,
          name: sanitizeInput(item.name, { trim: false }),
          stock: Number(item.stock),
          price: Number(item.price),
        }))
      );
    } catch (listError) {
      const message =
        listError instanceof Error
          ? listError.message
          : "Impossible to load products.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleRefresh = React.useCallback(() => {
    if (!isLoading) {
      void loadData();
    }
  }, [isLoading, loadData]);

  const handleRowClick = React.useCallback(
    (params: GridRowParams<Product>) => {
      navigate(`/products/${params.row.id}`);
    },
    [navigate]
  );

  const handleCreateClick = React.useCallback(() => {
    setModalMode("create");
    setSelectedProduct(null);
    setModalError(null);
    setIsModalOpen(true);
  }, []);

  const handleRowEdit = React.useCallback(
    (product: Product) => () => {
      setModalMode("edit");
      setSelectedProduct(product);
      setModalError(null);
      setIsModalOpen(true);
    },
    []
  );

  const handleRowDelete = React.useCallback(
    (product: Product) => async () => {
      if (isLoading || !token) {
        return;
      }

      setIsLoading(true);
      try {
        await deleteProduct(Number(product.id), { token });
        await loadData();
      } catch (deleteError) {
        const message =
          deleteError instanceof Error
            ? deleteError.message
            : "Impossible to delete the product.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, loadData, token]
  );

  const columns = React.useMemo<GridColDef<Product>[]>(
    () => [
      { field: "id", headerName: "ID", width: 90 },
      { field: "name", headerName: "Name", flex: 1, minWidth: 160 },
      {
        field: "price",
        headerName: "Price",
        type: "number",
        width: 120,
      },
      {
        field: "stock",
        headerName: "Stock",
        type: "number",
        width: 120,
      },
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        align: "right",
        getActions: (params: GridRowParams<Product>) => [
          <GridActionsCellItem
            key="edit"
            icon={<EditIcon />}
            label="Edit"
            onClick={handleRowEdit(params.row)}
          />,
          <GridActionsCellItem
            key="delete"
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleRowDelete(params.row)}
            showInMenu
          />,
        ],
      },
    ],
    [handleRowDelete, handleRowEdit]
  );

  return (
    <Stack spacing={2} sx={{ height: "100%", width: "100%" }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography align="left" component="h1" variant="h5">
            Products
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Manage the inventory available in your catalog.
          </Typography>
        </Box>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Refresh" placement="bottom" enterDelay={500}>
            <span>
              <IconButton
                size="small"
                aria-label="refresh"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Button
            variant="contained"
            onClick={handleCreateClick}
            startIcon={<AddIcon />}
          >
            New Product
          </Button>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper sx={{ flex: 1, p: 2 }} elevation={0} variant="outlined">
        <DataGrid
          rows={rows}
          columns={columns}
          autoHeight
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
          loading={isLoading}
          initialState={{
            pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } },
          }}
          pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
          sx={{
            [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
              outline: "transparent",
            },
            [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]:
              {
                outline: "none",
              },
            [`& .${gridClasses.row}:hover`]: {
              cursor: "pointer",
            },
          }}
          slotProps={{
            loadingOverlay: {
              variant: "circular-progress",
              noRowsVariant: "circular-progress",
            },
            baseIconButton: {
              size: "small",
            },
          }}
        />
      </Paper>
      <ProductModal
        open={isModalOpen}
        mode={modalMode}
        loading={isSaving}
        product={selectedProduct}
        errorMessage={modalError}
        onErrorClose={() => setModalError(null)}
        onClose={() => {
          if (!isSaving) {
            setIsModalOpen(false);
            setModalError(null);
          }
        }}
        onSubmit={async (payload) => {
          if (!token) {
            return;
          }

          setIsSaving(true);
          setModalError(null);

          try {
            if (modalMode === "create") {
              await createProduct(payload, { token });
            } else if (selectedProduct) {
              await updateProduct(selectedProduct.id, payload, { token });
            }

            setIsModalOpen(false);
            await loadData();
          } catch (submitError) {
            const message =
              submitError instanceof Error
                ? submitError.message
                : "Impossible to save the product.";
            setModalError(message);
            throw submitError;
          } finally {
            setIsSaving(false);
          }
        }}
      />
    </Stack>
  );
}
