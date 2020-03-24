import React, { Component } from 'react';
import { Table, Modal, ModalBody, ModalFooter, ModalHeader, Button } from 'reactstrap';
import Axios from 'axios';
import {API_URL} from '../supports/ApiUrl';
import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
import {changetoRupiah} from '../supports/changeToRp'
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom'

class ManageAdmin extends Component {
    state = {
        products: [],
        isModaladdOpen: false,
        isModaleditOpen: false,
        indexedit: 0,
        indexdelete:-1,
        categories: []
    }

    componentDidMount() {
        Axios.get(`${API_URL}/products?_expand=kategori`)
            .then((res) => {
                Axios.get(`${API_URL}/kategoris`)
                    .then((kategoris) => {
                        this.setState({ products: res.data, categories: kategoris.data})
                    })
            }).catch((err) => {
                console.log(err)
            })
    }

    toggleadd = () => {
        this.setState({ isModaladdOpen: !this.state.isModaladdOpen })
    }
    toggleedit = () => {
        this.setState({ isModaleditOpen: !this.state.isModaleditOpen })
    }

    onSaveadddataClick = () => {
        var namaadd = this.refs.namaadd.value
        var imageadd = this.refs.imageadd.value
        var stokadd = parseInt(this.refs.stokadd.value)
        var categoryadd = parseInt(this.refs.categoryadd.value)
        var hargaadd = parseInt(this.refs.hargaadd.value)
        var deskripsiadd = this.refs.deskripsiadd.value
        var obj = {
            name: namaadd,
            image: imageadd,
            stok: stokadd,
            kategoriId: categoryadd,
            harga: hargaadd,
            deskripsi: deskripsiadd
        }
        Axios.post(`${API_URL}/products`, obj)
            .then((res) => {
                console.log(res.data)
                Axios.get(`${API_URL}/products?_expand=kategori`)
                    .then((resakhir) => {
                        this.setState({ products: resakhir.data, isModaladdOpen: false })
                    }).catch((err) => {
                        console.log(err)
                    })
            }).catch((err) => {
                console.log(err)
            })
    }

    deleteconfirm = (index, id) => {
        Swal.fire({
            title: `Are you sure wanna delete ${this.state.products[index].name}?`,
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {
                Axios.delete(`${API_URL}/products/${id}`)
                    .then((res) => {
                        Swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        ).then((result) => {
                            if (result.value) {
                                Axios.get(`${API_URL}/products?_expand=kategori`)
                                    .then((res1) => {
                                        this.setState({ products: res1.data })
                                    })
                            }
                        })

                    }).catch((err) => {
                        console.log(err)
                    })
            }
        })
    }

    onsavEeditClick = () => {
        var namaedit = this.refs.namaedit.value
        var imageedit = this.refs.imageedit.value
        var stokedit = parseInt(this.refs.stokedit.value)
        var categoryedit = parseInt(this.refs.categoryedit.value)
        var hargaedit = parseInt(this.refs.hargaedit.value)
        var deskripsiedit = this.refs.deskripsiedit.value
        var obj = {
            name: namaedit,
            image: imageedit,
            stok: stokedit,
            kategoriId: categoryedit,
            harga: hargaedit,
            deskripsi: deskripsiedit
        }
        var id = this.state.products[this.state.indexedit].id
        console.log(obj, id)
        Axios.put(`${API_URL}/products/${id}`, obj)
            .then((res) => {
                // console.log(res.data)
                Axios.get(`${API_URL}/products?_expand=kategori`)
                    .then((resakhir) => {
                        this.setState({ products: resakhir.data, isModaleditOpen: false })
                    }).catch((err) => {
                        console.log(err)
                    })
            })
    }

    onEditClick = (index) => {
        this.setState({ indexedit: index, isModaleditOpen: true })
    }

    renderProducts = () => {
        const { products } = this.state
        return products.map((val, index) => {
            return (
                <tr key={index}>
                    <th scope='row'>{index + 1}</th>
                    <td>{val.name}</td>
                    <td><img src={val.image} alt={val.name} width='200' height='200px' /></td>
                    <td>{val.stok}</td>
                    <td>{val.kategori.nama}</td>
                    <td>{changetoRupiah(val.harga)}</td>
                    <td>{val.deskripsi}</td>
                    <td>
                        <button className='btn btn-primary' onClick={()=>this.onEditClick(index)}>Edit</button>
                        <button className='btn btn-danger' onClick={() => this.deleteconfirm(index, val.id)}>Delete</button>
                    </td>
                </tr>
            )
        })
    }

    rendercategorytoadd = () => {
        return this.state.categories.map((val, index) => {
            return <option key={index} value={val.id}>{val.nama}</option>
        })
    }
    render() {
        const { products, indexedit } = this.state
        if (this.props.User.role==='admin'){

            return (
                <div className='pt-5'>
                    <Modal isOpen={this.state.isModaladdOpen} toggle={this.toggleadd}>
                        <ModalHeader toggle={this.toggleadd}>Add data</ModalHeader>
                        <ModalBody>
                            <input type="text" ref='namaadd' placeholder='Product name' className='form-control mt-2' />
                            <input type="text" ref='imageadd' placeholder='Url Image' className='form-control mt-2' />
                            <input type="number" ref='stokadd' placeholder='Jumlah stok' className='form-control mt-2' />
                            <select ref='categoryadd' className='form-control mt-2'>
                                <option value="" hidden>Pilih category</option>
                                {this.rendercategorytoadd()}
                            </select>
                            <input type="number" ref='hargaadd' placeholder='Harga' className='form-control mt-2' />
                            <textarea ref="deskripsiadd" className='form-control mt-2' placeholder='deskripsi' cols="20" rows="5"></textarea>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.onSaveadddataClick}>Save</Button>
                            <Button color="secondary" onClick={this.toggleadd}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                    {
                        this.state.products.length ?
                            <Modal isOpen={this.state.isModaleditOpen} toggle={this.toggleedit}>
                                <ModalHeader toggle={this.toggleedit}>Edit data {products[indexedit].name}</ModalHeader>
                                <ModalBody>
                                    <input type="text" ref='namaedit' defaultValue={products[indexedit].name} placeholder='Product name' className='form-control mt-2' />
                                    <input type="text" ref='imageedit' defaultValue={products[indexedit].image} placeholder='Url Image' className='form-control mt-2' />
                                    <input type="number" ref='stokedit' defaultValue={products[indexedit].stok} placeholder='Jumlah stok' className='form-control mt-2' />
                                    <select ref='categoryedit' defaultValue={products[indexedit].kategoriId} className='form-control mt-2'>
                                        {this.rendercategorytoadd()}
                                    </select>
                                    <input type="number" ref='hargaedit' defaultValue={products[indexedit].harga} placeholder='Harga' className='form-control mt-2' />
                                    <textarea ref="deskripsiedit" className='form-control mt-2' defaultValue={products[indexedit].deskripsi} placeholder='deskripsi' cols="20" rows="5"></textarea>
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={this.onsavEeditClick}>Save</Button>
                                    <Button color="secondary" onClick={this.toggleedit}>Cancel</Button>
                                </ModalFooter>
                            </Modal>
                            :
                            null
                    }
                    <button className='btn btn-primary mt-5' onClick={this.toggleadd}>Add data</button>
                    <Table striped>
                        <thead style={{textAlign:"center"}}>
                            <tr>
                                <th>No</th>
                                <th>Name</th>
                                <th>image</th>
                                <th>Stok</th>
                                <th>Category</th>
                                <th>Harga</th>
                                <th>Deskripsi</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderProducts()}
                        </tbody>
                    </Table>
                </div>
            );
        }else{
            return <Redirect to = '/notfound'/>
        }
    }
}

const MapstatetoProps=(state)=>{
    return{
        User:state.Auth
    }
}

export default connect (MapstatetoProps) (ManageAdmin);