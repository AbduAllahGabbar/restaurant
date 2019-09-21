module.exports = function init(site) {

  let collection_name = 'employee_list'

  let source = {
    name: 'Employee System',
    ar: 'نظام الموظفين'
  }

  let image_url = '/images/employee.png'
  let add_message = {
    name: 'New Employee Added',
    ar: 'تم أضافة موظف جديد'
  }
  let update_message = {
    name: ' Employee Updated',
    ar: 'تم تعديل موظف'
  }
  let delete_message = {
    name: ' Employee Deleted',
    ar: 'تم حذف موظف '
  }


  site.on('mongodb after insert', function (result) {
    if (result.collection === collection_name) {
      site.call('please monitor action', {
        obj: {
          icon: image_url,
          source: source,
          message: add_message,
          value: {
            name: result.doc.name,
            ar: result.doc.name
          },
          add: result.doc,
          action: 'add'
        },
        result: result
      })
    }
  })

  site.on('mongodb after update', function (result) {
    if (result.collection === collection_name) {
      site.call('please monitor action', {
        obj: {
          icon: image_url,
          source: source,
          message: update_message,
          value: {
            name: result.old_doc.name,
            ar: result.old_doc.name
          },
          update: site.objectDiff(result.update.$set, result.old_doc),
          action: 'update'
        },
        result: result
      })
    }
  })


  site.on('mongodb after delete', function (result) {
    if (result.collection === collection_name) {
      site.call('please monitor action', {
        obj: {
          icon: image_url,
          source: source,
          message: delete_message,
          value: {
            name: result.doc.name,
            ar: result.doc.name
          },
          delete: result.doc,
          action: 'delete'
        },
        result: result
      })
    }
  })

}