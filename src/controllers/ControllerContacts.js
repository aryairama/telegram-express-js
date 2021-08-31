import contactsModel from '../models/contacts.js';
import { response, responsePagination } from '../helpers/helpers.js';

const readContact = async (req, res, next) => {
  const search = req.query.search || '';
  let order = req.query.order || '';
  if (order.toUpperCase() === 'ASC') {
    order = 'ASC';
  } else if (order.toUpperCase() === 'DESC') {
    order = 'DESC';
  } else {
    order = 'DESC';
  }
  let { fieldOrder } = req.query;
  if (fieldOrder) {
    if (fieldOrder.toLowerCase() === 'name') {
      fieldOrder = 'name';
    } else {
      fieldOrder = 'user_id';
    }
  } else {
    fieldOrder = 'user_id';
  }
  try {
    const recentContacts = await contactsModel.getContactById(req.userLogin.user_id);
    const contactsId = [req.userLogin.user_id];
    recentContacts.forEach((contact) => {
      contactsId.push(contact.contact_user_id);
    });
    let dataContacts;
    let pagination;
    const lengthRecord = Object.keys(
      await contactsModel.publicContact(search, order, fieldOrder, contactsId),
    ).length;
    if (lengthRecord > 0) {
      const limit = req.query.limit || 5;
      const pages = Math.ceil(lengthRecord / limit);
      let page = req.query.page || 1;
      let nextPage = parseInt(page, 10) + 1;
      let prevPage = parseInt(page, 10) - 1;
      if (nextPage > pages) {
        nextPage = pages;
      }
      if (prevPage < 1) {
        prevPage = 1;
      }
      if (page > pages) {
        page = pages;
      } else if (page < 1) {
        page = 1;
      }
      const start = (page - 1) * limit;
      pagination = {
        countData: lengthRecord,
        pages,
        limit: parseInt(limit, 10),
        curentPage: parseInt(page, 10),
        nextPage,
        prevPage,
      };
      dataContacts = await contactsModel.publicContact(
        search,
        order,
        fieldOrder,
        contactsId,
        start,
        limit,
      );
      responsePagination(res, 'success', 200, 'data public contacts', dataContacts, pagination);
    } else {
      dataContacts = await contactsModel.publicContact(search, order, fieldOrder, contactsId);
      response(res, 'success', 200, 'data public contacts', dataContacts);
    }
  } catch (error) {
    next(error);
  }
};

const privateContact = async (req, res, next) => {
  const search = req.query.search || '';
  let order = req.query.order || '';
  if (order.toUpperCase() === 'ASC') {
    order = 'ASC';
  } else if (order.toUpperCase() === 'DESC') {
    order = 'DESC';
  } else {
    order = 'DESC';
  }
  let { fieldOrder } = req.query;
  if (fieldOrder) {
    if (fieldOrder.toLowerCase() === 'name') {
      fieldOrder = 'users.name';
    } else {
      fieldOrder = 'users.user_id';
    }
  } else {
    fieldOrder = 'users.user_id';
  }
  try {
    let dataContacts;
    let pagination;
    const lengthRecord = Object.keys(
      await contactsModel.privateContact(search, order, fieldOrder, req.userLogin.user_id),
    ).length;
    if (lengthRecord > 0) {
      const limit = req.query.limit || 5;
      const pages = Math.ceil(lengthRecord / limit);
      let page = req.query.page || 1;
      let nextPage = parseInt(page, 10) + 1;
      let prevPage = parseInt(page, 10) - 1;
      if (nextPage > pages) {
        nextPage = pages;
      }
      if (prevPage < 1) {
        prevPage = 1;
      }
      if (page > pages) {
        page = pages;
      } else if (page < 1) {
        page = 1;
      }
      const start = (page - 1) * limit;
      pagination = {
        countData: lengthRecord,
        pages,
        limit: parseInt(limit, 10),
        curentPage: parseInt(page, 10),
        nextPage,
        prevPage,
      };
      dataContacts = await contactsModel.privateContact(search, order, fieldOrder, req.userLogin.user_id, start, limit);
      responsePagination(res, 'success', 200, 'data private contacts', dataContacts, pagination);
    } else {
      dataContacts = await contactsModel.privateContact(search, order, fieldOrder, req.userLogin.user_id);
      response(res, 'success', 200, 'data private contacts', dataContacts);
    }
  } catch (error) {
    next(error);
  }
};

export default { readContact, privateContact };
