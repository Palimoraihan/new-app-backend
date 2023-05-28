/* eslint-disable import/no-extraneous-dependencies */
const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (req, h) => {
  const { title, tags, body } = req.payload;
  const id = nanoid(16);
  const createAt = new Date().toISOString();
  const updateAt = createAt;
  const newNode = {
    title,
    tags,
    body,
    id,
    createAt,
    updateAt,
  };

  notes.push(newNode);

  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    const respons = h.response({
      status: 'Success',
      message: 'Catat Berhasil Di Tambahkan',
      data: {
        noteId: id,
        tag: tags,
      },
    });
    console.log(respons.source);
    respons.code(200);
    return respons;
  }
  const respons = h.response({
    status: 'Fail',
    message: 'Catatan Gagal di Tambah',
  });
  respons.code(500);
  return respons;
};

const getAllNoteHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

const getNoteByIdHandler = (req, h) => {
  const { id } = req.params;
  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      status: 'success',
      data: {
        note,
      },
    };
  }
  const respons = h.response({
    status: 'fail',
    message: 'Catatan tidak di temukan',
  });
  respons.code(404);
  return respons;
};

const editNoteNyIdHandler = (req, h) => {
  const { id } = req.params;
  const { title, tag, body } = req.payload;

  const updateAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tag,
      body,
      updateAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui catatan. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteNoteByIdHandler = (req, h) => {
  const { id } = req.params;
  const idx = notes.findIndex((note) => note.id === id);

  if (idx !== -1) {
    notes.splice(idx, 1);
    const respons = h.response({
      status: 'success',
      message: 'Catat Berhasil di Apus',
    });
    respons.code(200);
    return respons;
  }
  const response = h.response({
    status: 'fail',
    message: 'Catatan gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNoteHandler,
  getNoteByIdHandler,
  editNoteNyIdHandler,
  deleteNoteByIdHandler,
};
