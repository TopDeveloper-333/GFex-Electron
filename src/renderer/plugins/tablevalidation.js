import Vue from 'vue'

Vue.mixin({
  methods: {
    validationTable:function(instance, cell, col, row, val, label, cellName) {
      var value = parseFloat(val)
      
      if ((isNaN(value) == true) || (value < 0)) {
        this.markInvalidCell(cell)
      }
      else {
        this.markNormalCell(cell)
      }
    },
    markInvalidCell: function(cell) {
      cell.style.backgroundColor = '#f46e42'
      cell.style.color = 'white'
    },
    markNormalCell: function(cell) {
      cell.style.backgroundColor = 'green'
      cell.style.color = 'white'
    }
  }
})