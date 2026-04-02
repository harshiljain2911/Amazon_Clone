import User from '../models/userModel.js';

/* ── Get own profile ── */
export const getProfileService = async (userId) => {
  const user = await User.findById(userId).select('-password -refreshToken');
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  return user;
};

/* ── Update profile ── */
export const updateProfileService = async (userId, { name, phone }) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { ...(name && { name }), ...(phone && { phone }) },
    { new: true, runValidators: true, select: '-password -refreshToken' }
  );
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
  return user;
};

/* ── Addresses ── */
export const addAddressService = async (userId, addressData) => {
  const user = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  // If first address or flagged as default → clear existing defaults
  if (addressData.isDefault || user.addresses.length === 0) {
    user.addresses.forEach((a) => { a.isDefault = false; });
    addressData.isDefault = true;
  }

  user.addresses.push(addressData);
  await user.save();
  return user.addresses;
};

export const updateAddressService = async (userId, addressId, addressData) => {
  const user = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  const addr = user.addresses.id(addressId);
  if (!addr) throw Object.assign(new Error('Address not found'), { status: 404 });

  if (addressData.isDefault) {
    user.addresses.forEach((a) => { a.isDefault = false; });
  }

  Object.assign(addr, addressData);
  await user.save();
  return user.addresses;
};

export const deleteAddressService = async (userId, addressId) => {
  const user = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  user.addresses = user.addresses.filter((a) => a._id.toString() !== addressId);
  await user.save();
  return user.addresses;
};

export const setDefaultAddressService = async (userId, addressId) => {
  const user = await User.findById(userId);
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 });

  const addr = user.addresses.id(addressId);
  if (!addr) throw Object.assign(new Error('Address not found'), { status: 404 });

  user.addresses.forEach((a) => { a.isDefault = a._id.toString() === addressId; });
  await user.save();
  return user.addresses;
};
