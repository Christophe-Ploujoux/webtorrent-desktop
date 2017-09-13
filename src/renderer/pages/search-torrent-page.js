const React = require('react')

const Table = require("material-ui/Table").default
const TableBody = require("material-ui/Table").TableBody
const TableHeader = require("material-ui/Table").TableHeader
const TableHeaderColumn = require("material-ui/Table").TableHeaderColumn
const TableRow = require("material-ui/Table").TableRow
const TableRowColumn = require("material-ui/Table").TableRowColumn
const FontIcon = require('material-ui/FontIcon').default;
const TextField = require('material-ui/TextField').default;
const CircularProgress = require('material-ui/CircularProgress').default;
const Snackbar = require('material-ui/Snackbar').default;

const nodeConsole = require('console');
const myConsole = new nodeConsole.Console(process.stdout, process.stderr);

const {dispatch, dispatcher} = require('../lib/dispatcher');
const config = require('../../config');

class SearchPage extends React.Component {
  constructor (props) {
    super(props)
  }

  handleSubmit() {
    dispatch('getSearchTorrent', 'Game of thrones');    
  }

  handleDownloadTorrent(torrent) {
    dispatch('addTorrent', torrent.magnetLink, true, true)
  }

  render () {
    return (
      <div className="search-torrent-page">
        {this.renderForm()}
        {this.props.state.searchLoading ? this.renderLoader() : this.renderTable() }
        {this.renderSnackBar()}
      </div>
    )
  }

  renderTableRows() {
    let style = {
      width: "750px"
    }
    if (!this.props.state.saved.searchTorrents) this.props.state.saved.searchTorrents = []
    return this.props.state.saved.searchTorrents.map((torrent) => {
      return (
        <TableRow>
          <TableRowColumn style={style}>{torrent.name}</TableRowColumn>
          <TableRowColumn>{torrent.category}</TableRowColumn>
          <TableRowColumn>{torrent.seeds}</TableRowColumn>
          <TableRowColumn>{torrent.peers}</TableRowColumn>
          <TableRowColumn>{torrent.size}</TableRowColumn>
          <TableRowColumn>
            <i
              className='icon url'
              title='Download torrent'
              onClick={() => this.handleDownloadTorrent(torrent)}>
              file_download
            </i>
          </TableRowColumn>
        </TableRow>
      )
    });
  }

  renderTable() {
    let style = {
      width: "750px"
    }
    return (
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn style={style}>Name</TableHeaderColumn>
            <TableHeaderColumn>Category</TableHeaderColumn>
            <TableHeaderColumn>Seeders</TableHeaderColumn>
            <TableHeaderColumn>Leecher</TableHeaderColumn>
            <TableHeaderColumn>Size</TableHeaderColumn>
            <TableHeaderColumn></TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {this.renderTableRows()}
        </TableBody>
      </Table>
    )
  }

  renderLoader() {
    return (
      <div className="loader-container">
        <CircularProgress className="loader" size={60} thickness={5} />
      </div>
    )
  }

  renderForm() {
    return (
      <form className="search-form" onSubmit={(event) => dispatch('getSearchTorrent')}>
        <TextField
          className="search-input-field"
          hintText="Chercher un torrent"
          value={this.props.state.saved.activeSearchTorrent}
          onChange={(event) => dispatch('setActiveSearchTorrent', event.target.value)}
        /><br />
      </form>
    );
  }

  renderSnackBar() {
    return (
      <Snackbar
        open={this.props.state.snackBar}
        message="Torrent added to your list"
        autoHideDuration={4000}
        onRequestClose={()=> this.props.state.snackBar = false}
      />
    )
  }
}

module.exports = SearchPage
