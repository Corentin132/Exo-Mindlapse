import CloseIcon from "@mui/icons-material/Close";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type { SxProps, Theme } from "@mui/material/styles";
import * as React from "react";

import type { Product } from "@admin-dashboard/types";

const DEFAULT_PRODUCT: Pick<Product, "name" | "price" | "stock"> = {
  name: "",
  price: 0,
  stock: 0,
};

interface ProductModalProps {
  open: boolean;
  mode: "create" | "edit";
  loading?: boolean;
  product?: Product | null;
  onClose: () => void;
  onSubmit: (
    payload: Pick<Product, "name" | "price" | "stock">
  ) => Promise<void> | void;
  errorMessage?: string | null;
  onErrorClose?: () => void;
  sx?: SxProps<Theme>;
}

export function ProductModal({
  open,
  mode,
  loading = false,
  product,
  onClose,
  onSubmit,
  errorMessage,
  onErrorClose,
  sx,
}: ProductModalProps) {
  const [values, setValues] = React.useState(DEFAULT_PRODUCT);
  const [errors, setErrors] = React.useState<{
    name?: string;
    price?: string;
    stock?: string;
  }>({});

  React.useEffect(() => {
    if (open) {
      setValues(
        product
          ? {
              name: product.name,
              price: product.price,
              stock: product.stock,
            }
          : DEFAULT_PRODUCT
      );
      setErrors({});
    }
  }, [open, product]);

  const validate = React.useCallback(() => {
    const nextErrors: typeof errors = {};

    if (!values.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!Number.isFinite(values.price) || values.price < 0) {
      nextErrors.price = "Price must be a positive number.";
    }

    if (!Number.isInteger(values.stock) || values.stock < 0) {
      nextErrors.stock = "Stock must be a positive integer.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }, [values]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    try {
      await onSubmit({
        name: values.name.trim(),
        price: values.price,
        stock: values.stock,
      });
    } catch (submitError) {
      // Let parent component display the error message
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ pr: 6 }}>
        {mode === "create" ? "Create a product" : "Edit the product"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          disabled={loading}
          sx={{ position: "absolute", top: 12, right: 12 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit}
          sx={{ mt: 1, ...sx }}
        >
          <Stack spacing={2}>
            {errorMessage && (
              <Alert
                severity="error"
                onClose={loading ? undefined : onErrorClose}
              >
                {errorMessage}
              </Alert>
            )}
            <TextField
              label="Nom"
              value={values.name}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, name: event.target.value }))
              }
              error={Boolean(errors.name)}
              helperText={errors.name}
              autoFocus
              required
            />
            <TextField
              label="Prix"
              type="number"
              inputProps={{ step: "0.01", min: 0 }}
              value={values.price}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  price: Number(event.target.value),
                }))
              }
              error={Boolean(errors.price)}
              helperText={errors.price}
              required
            />
            <TextField
              label="Stock"
              type="number"
              inputProps={{ step: "1", min: 0 }}
              value={values.stock}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  stock: Number(event.target.value),
                }))
              }
              error={Boolean(errors.stock)}
              helperText={errors.stock}
              required
            />
            <DialogActions sx={{ px: 0 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
                fullWidth
              >
                {mode === "create" ? "Create" : "Update"}
              </LoadingButton>
            </DialogActions>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default ProductModal;
