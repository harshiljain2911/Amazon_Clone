import {
  getProfileService,
  updateProfileService,
  addAddressService,
  updateAddressService,
  deleteAddressService,
  setDefaultAddressService,
} from '../services/userService.js';

/* ── GET /api/users/profile ── */
export const getProfile = async (req, res, next) => {
  try {
    const user = await getProfileService(req.user._id);
    res.status(200).json(user);
  } catch (err) { res.status(err.status || 500); next(err); }
};

/* ── PUT /api/users/profile ── */
export const updateProfile = async (req, res, next) => {
  try {
    const user = await updateProfileService(req.user._id, req.body);
    res.status(200).json(user);
  } catch (err) { res.status(err.status || 500); next(err); }
};

/* ── POST /api/users/addresses ── */
export const addAddress = async (req, res, next) => {
  try {
    const addresses = await addAddressService(req.user._id, req.body);
    res.status(201).json(addresses);
  } catch (err) { res.status(err.status || 500); next(err); }
};

/* ── PUT /api/users/addresses/:id ── */
export const updateAddress = async (req, res, next) => {
  try {
    const addresses = await updateAddressService(req.user._id, req.params.id, req.body);
    res.status(200).json(addresses);
  } catch (err) { res.status(err.status || 500); next(err); }
};

/* ── DELETE /api/users/addresses/:id ── */
export const deleteAddress = async (req, res, next) => {
  try {
    const addresses = await deleteAddressService(req.user._id, req.params.id);
    res.status(200).json(addresses);
  } catch (err) { res.status(err.status || 500); next(err); }
};

/* ── PUT /api/users/addresses/:id/default ── */
export const setDefaultAddress = async (req, res, next) => {
  try {
    const addresses = await setDefaultAddressService(req.user._id, req.params.id);
    res.status(200).json(addresses);
  } catch (err) { res.status(err.status || 500); next(err); }
};
